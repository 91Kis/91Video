
// social_realtime.js
// Hybrid realtime: DEMO (BroadcastChannel+localStorage) and Firebase Firestore.
// Toggle via initRealtime({ mode: 'DEMO' | 'FIREBASE', firebaseConfig })
let fb = null, app=null, auth=null, db=null;

const bc = ('BroadcastChannel' in self) ? new BroadcastChannel('rt_demo') : null;
const now = ()=> Date.now();
const pad6 = x => String(x).padStart(6,'0');

const Demo = {
  users: ()=> JSON.parse(localStorage.getItem('v91_users')||'[]'),
  setUsers: v => localStorage.setItem('v91_users', JSON.stringify(v)),
  me: ()=> { try{ return JSON.parse(localStorage.getItem('v91_user')||'{}'); }catch{return {}} },
  setMe: v => localStorage.setItem('v91_user', JSON.stringify(v)),
  reqs: ()=> JSON.parse(localStorage.getItem('v91_friendReqs')||'[]'),
  setReqs: v => localStorage.setItem('v91_friendReqs', JSON.stringify(v)),
  chats: ()=> JSON.parse(localStorage.getItem('v91_chats')||'{}'),
  setChats: v => localStorage.setItem('v91_chats', JSON.stringify(v)),
  comments: ()=> JSON.parse(localStorage.getItem('v91_comments')||'[]'),
  setComments: v => localStorage.setItem('v91_comments', JSON.stringify(v)),
  seed(){
    if(!localStorage.getItem('v91_seeded')){
      const me = { id:'100001', nick:'演示用户', bio:'这是一个演示账号' };
      Demo.setMe(me);
      Demo.setUsers([{ id:'100001', nick:'演示用户', bio:'这是一个演示账号' }]);
      localStorage.setItem('v91_seeded','1');
    }
  },
  emit(topic, payload){ if(bc) bc.postMessage({topic,payload}); },
  on(topic, handler){ if(!bc) return ()=>{}; const fn = (e)=>{ if(e.data?.topic===topic) handler(e.data.payload); }; bc.addEventListener('message', fn); return ()=> bc.removeEventListener('message', fn); }
};

export async function initRealtime({mode='DEMO', firebaseConfig}={}){
  if(mode === 'DEMO'){ Demo.seed(); return { backend:'demo' }; }
  // Firebase
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
  const { getAuth, onAuthStateChanged, signInAnonymously } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
  const { getFirestore, doc, getDoc, setDoc, updateDoc, runTransaction,
          collection, addDoc, onSnapshot, query, where, orderBy, limit, serverTimestamp, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  await signInAnonymously(auth);
  fb = { doc, getDoc, setDoc, updateDoc, runTransaction, collection, addDoc, onSnapshot, query, where, orderBy, limit, serverTimestamp, deleteDoc, onAuthStateChanged };
  return { backend:'firebase' };
}

export function getCurrentUid(){
  if(fb) return (auth?.currentUser?.uid)||null;
  return Demo.me().id || null;
}

export async function ensureProfile(){
  if(!fb){ return; }
  const {doc, getDoc, setDoc, runTransaction} = fb;
  const u = await new Promise(res=> fb.onAuthStateChanged(x=> res(x)));
  const uref = doc(db, 'users', u.uid);
  const snap = await getDoc(uref);
  if(!snap.exists()){ await setDoc(uref, { displayName: '匿名用户', bio:'', createdAt: now() }, { merge:true }); }
  await runTransaction(db, async (tx)=>{
    const s = await tx.get(uref);
    if(s.exists() && s.data().id6) return;
    for(let i=0;i<6;i++){
      const code = String(Math.floor(100000 + Math.random()*900000));
      const cref = doc(db,'user_codes', code);
      const cs = await tx.get(cref);
      if(!cs.exists()){
        tx.set(cref, { uid: u.uid });
        tx.set(uref, { id6: code }, { merge:true });
        return;
      }
    }
    throw new Error('生成 6 位 ID 失败');
  });
}

/* Friends */
export async function findUserById6(id6){
  if(fb){
    const {collection, query, where, limit, onSnapshot} = fb;
    return new Promise((resolve)=>{
      const q = query(collection(db,'users'), where('id6','==', id6), limit(1));
      const unsub = onSnapshot(q, snap=>{
        unsub();
        if(snap.empty) resolve(null);
        else { const d = snap.docs[0]; resolve({ uid:d.id, id6, displayName:d.data().displayName||'', bio:d.data().bio||'' }); }
      });
    });
  }else{
    const u = Demo.users().find(u=> pad6(u.id)===id6);
    return u ? { uid: u.id, id6: pad6(u.id), displayName: u.nick||'', bio:u.bio||'' } : null;
  }
}
export async function sendFriendRequest(toUid){
  if(fb){
    const {collection, addDoc, serverTimestamp} = fb;
    await addDoc(collection(db,'friendRequests'), { from:getCurrentUid(), to:toUid, status:'pending', createdAt: serverTimestamp() });
  }else{
    const arr = Demo.reqs(); arr.push({ from:getCurrentUid(), to:toUid, status:'pending', ts: now() }); Demo.setReqs(arr); Demo.emit('reqs',{});
  }
}

/* Chats & Messages */
function ensureChatDemo(map, id){ map[id] = map[id]||{ id, isGroup:false, ownerId:null, admins:[], members:[], blacklist:[], mutes:{}, messages:[] }; return map[id]; }

export async function createGroup(name, memberUids){
  const me = getCurrentUid();
  const uniq = Array.from(new Set([me, ...memberUids.filter(Boolean)]));
  if(uniq.length<3) throw new Error('群聊至少 3 人');
  if(fb){
    const {collection, addDoc, serverTimestamp} = fb;
    const members = {}; uniq.forEach(u=> members[u] = (u===me ? 'owner' : 'member'));
    const ref = await addDoc(collection(db,'chats'), { isGroup:true, name:name||'未命名群聊', ownerId: me, members, memberIds:Object.keys(members), admins:[], blacklist:[], mutes:{}, createdAt: serverTimestamp() });
    return ref.id;
  }else{
    const id='g'+Math.random().toString(36).slice(2,8);
    const map = Demo.chats(); map[id] = { id, isGroup:true, name: name||'未命名群聊', ownerId: me, admins:[], members: uniq.filter(x=>x!==me), blacklist:[], mutes:{}, messages:[] };
    Demo.setChats(map); Demo.emit('chats',{}); return id;
  }
}

export async function createDM(partnerUid){
  const me = getCurrentUid();
  if(fb){
    const {collection, addDoc, serverTimestamp} = fb;
    const members = {}; [me, partnerUid].forEach(u=> members[u]='member');
    const ref = await addDoc(collection(db,'chats'), { isGroup:false, members, memberIds:Object.keys(members), createdAt: serverTimestamp() });
    return ref.id;
  }else{
    const id='d'+Math.random().toString(36).slice(2,10);
    const map = Demo.chats(); map[id] = { id, isGroup:false, ownerId:null, admins:[], members:[partnerUid], blacklist:[], mutes:{}, messages:[] };
    Demo.setChats(map); Demo.emit('chats',{}); return id;
  }
}

export async function listMyChats(cb){
  const me = getCurrentUid();
  if(fb){
    const {collection, query, where, onSnapshot} = fb;
    const q = query(collection(db,'chats'), where('memberIds','array-contains', me));
    return onSnapshot(q, snap=>{
      const arr = snap.docs.map(d=> ({ id:d.id, ...d.data() }));
      cb(arr);
    });
  }else{
    const render = ()=>{
      const map = Demo.chats();
      const arr = Object.values(map).filter(c=> c.ownerId===me || (c.members||[]).includes(me) || (c.admins||[]).includes(me));
      cb(arr);
    };
    const unsub = Demo.on('chats', render); render(); return unsub;
  }
}

export async function sendMessage(chatId, text){
  const me = getCurrentUid();
  if(fb){
    const {doc, getDoc, collection, addDoc, serverTimestamp} = fb;
    const cref = doc(db,'chats', chatId); const c = await getDoc(cref); if(!c.exists()) throw new Error('聊天不存在');
    const chat = c.data();
    if((chat.blacklist||[]).includes(me)) throw new Error('你已被拉黑');
    const until = (chat.mutes||{})[me]; if(until && until > Date.now()) throw new Error('你正在被禁言');
    await addDoc(collection(db,'chats',chatId,'messages'), { senderId: me, content:text, recalled:false, createdAt: serverTimestamp() });
  }else{
    const map = Demo.chats(); const g = ensureChatDemo(map, chatId);
    g.messages.push({ id:String(now()), from: me, text, recalled:false, ts: now() });
    Demo.setChats(map); Demo.emit('msgs',{chatId});
  }
}

export async function subscribeMessages(chatId, cb){
  if(fb){
    const {collection, query, orderBy, onSnapshot} = fb;
    const q = query(collection(db,'chats',chatId,'messages'), orderBy('createdAt','asc'));
    return onSnapshot(q, snap=>{
      const arr = snap.docs.map(d=> ({ id:d.id, ...d.data() }));
      cb(arr);
    });
  }else{
    const render = ()=>{
      const g = Demo.chats()[chatId] || {messages:[]};
      const arr = (g.messages||[]).map(m=> ({ id:String(m.id||m.ts), senderId:m.from, content:m.text, recalled:m.recalled, createdAt:m.ts }));
      cb(arr);
    };
    const unsub = Demo.on('msgs', p=>{ if(p.chatId===chatId) render(); });
    render(); return unsub;
  }
}

export async function recallMessage(chatId, messageId){
  const me = getCurrentUid();
  if(fb){
    const {doc, updateDoc} = fb;
    const mref = doc(db,'chats',chatId,'messages', messageId);
    await updateDoc(mref, { recalled:true, content:'' });
  }else{
    const map = Demo.chats(); const g = map[chatId]; if(!g) return;
    const it = (g.messages||[]).find(m=> String(m.id||m.ts)===String(messageId) && m.from===me);
    if(it){ it.recalled=true; it.text=''; Demo.setChats(map); Demo.emit('msgs',{chatId}); }
  }
}

/* Group admin */
function roleOf(chat, uid){
  if(!chat || !chat.isGroup) return null;
  if(chat.ownerId===uid) return 'owner';
  if((chat.admins||[]).includes(uid)) return 'admin';
  if((chat.members||[]).includes(uid) || (chat.members && chat.members[uid])) return 'member';
  return null;
}

export async function postAnnouncement(chatId, text){
  if(fb){
    const {doc, getDoc, collection, addDoc, serverTimestamp} = fb;
    const cref = doc(db,'chats',chatId); const c=await getDoc(cref); const chat=c.data();
    const me = getCurrentUid(); const r = chat.members?.[me] || (roleOf(chat, me));
    if(!['owner','admin'].includes(r)) throw new Error('需要管理员权限');
    await addDoc(collection(db,'chats',chatId,'announcements'), { text, createdBy: me, createdAt: serverTimestamp() });
  }else{
    // demo: skip persistence
  }
}

export async function inviteMember(chatId, uid){
  if(fb){
    const {doc, getDoc, updateDoc} = fb;
    const cref = doc(db,'chats',chatId); const c=await getDoc(cref); const chat=c.data(); const me=getCurrentUid();
    const r = chat.members?.[me] || (roleOf(chat, me)); if(!['owner','admin'].includes(r)) throw new Error('需要管理员权限');
    const members={...(chat.members||{})}; members[uid]='member';
    const memberIds = Array.from(new Set([...(chat.memberIds||[]), uid]));
    await updateDoc(cref, { members, memberIds });
  }else{
    const map = Demo.chats(); const g=map[chatId]; if(!g) return;
    if(!g.members.includes(uid)) g.members.push(uid); Demo.setChats(map); Demo.emit('chats',{});
  }
}

export async function kickMember(chatId, uid){
  if(fb){
    const {doc, getDoc, updateDoc} = fb;
    const cref=doc(db,'chats',chatId); const c=await getDoc(cref); const chat=c.data(); const me=getCurrentUid();
    const r = chat.members?.[me] || (roleOf(chat, me)); if(!['owner','admin'].includes(r)) throw new Error('需要管理员权限');
    const members = {...(chat.members||{})}; delete members[uid]; const memberIds=Object.keys(members);
    await updateDoc(cref, { members, memberIds });
  }else{
    const map = Demo.chats(); const g=map[chatId]; if(!g) return;
    g.members = (g.members||[]).filter(x=>x!==uid); g.admins=(g.admins||[]).filter(x=>x!==uid);
    Demo.setChats(map); Demo.emit('chats',{});
  }
}

export async function muteMember(chatId, uid, minutes){
  if(fb){
    const {doc, getDoc, updateDoc} = fb;
    const cref=doc(db,'chats',chatId); const c=await getDoc(cref); const chat=c.data(); const me=getCurrentUid();
    const r = chat.members?.[me] || (roleOf(chat, me)); if(!['owner','admin'].includes(r)) throw new Error('需要管理员权限');
    const mutes = {...(chat.mutes||{})}; mutes[uid] = Date.now()+ minutes*60*1000;
    await updateDoc(cref, { mutes });
  }else{
    const map = Demo.chats(); const g=map[chatId]; if(!g) return; g.mutes=g.mutes||{}; g.mutes[uid] = Date.now()+ minutes*60*1000; Demo.setChats(map);
  }
}

export async function blacklistMember(chatId, uid){
  if(fb){
    const {doc, getDoc, updateDoc} = fb;
    const cref=doc(db,'chats',chatId); const c=await getDoc(cref); const chat=c.data(); const me=getCurrentUid();
    const r = chat.members?.[me] || (roleOf(chat, me)); if(!['owner','admin'].includes(r)) throw new Error('需要管理员权限');
    const blacklist = Array.from(new Set([...(chat.blacklist||[]), uid]));
    await updateDoc(cref, { blacklist });
  }else{
    const map = Demo.chats(); const g=map[chatId]; if(!g) return; g.blacklist = Array.from(new Set([...(g.blacklist||[]), uid])); Demo.setChats(map);
  }
}

export async function setAdmins(chatId, admins){
  if(fb){
    const {doc, getDoc, updateDoc} = fb;
    const cref=doc(db,'chats',chatId); const c=await getDoc(cref); const chat=c.data();
    if(chat.ownerId !== getCurrentUid()) throw new Error('仅群主可设置管理员');
    const uniq = Array.from(new Set(admins)).filter(x=>x!==chat.ownerId);
    if(uniq.length>3) throw new Error('管理员最多 3 人');
    const members={...(chat.members||{})};
    // reset all to member
    Object.keys(members).forEach(u=>{ if(members[u]==='admin') members[u]='member'; });
    uniq.forEach(u=>{ if(members[u]) members[u]='admin'; });
    const memberIds = Object.keys(members);
    await updateDoc(cref, { admins: uniq, members, memberIds });
  }else{
    const map=Demo.chats(); const g=map[chatId]; if(!g) return;
    const uniq = Array.from(new Set(admins)).filter(x=>x!==g.ownerId);
    if(uniq.length>3) throw new Error('管理员最多 3 人');
    g.admins = uniq; Demo.setChats(map); Demo.emit('chats',{});
  }
}

export async function leaveGroup(chatId){
  if(fb){
    const {doc, getDoc, updateDoc} = fb;
    const cref=doc(db,'chats',chatId); const c=await getDoc(cref); const chat=c.data();
    if(chat.ownerId === getCurrentUid()) throw new Error('群主不能直接退出，请先解散');
    const members={...(chat.members||{})}; delete members[getCurrentUid()]; const memberIds=Object.keys(members);
    await updateDoc(cref, { members, memberIds });
  }else{
    const map=Demo.chats(); const g=map[chatId]; if(!g) return;
    g.members = (g.members||[]).filter(x=>x!==getCurrentUid()); g.admins=(g.admins||[]).filter(x=>x!==getCurrentUid()); Demo.setChats(map); Demo.emit('chats',{});
  }
}

export async function dissolveGroup(chatId){
  if(fb){
    const {doc, getDoc, deleteDoc} = fb;
    const cref=doc(db,'chats',chatId); const c=await getDoc(cref); const chat=c.data();
    if(chat.ownerId !== getCurrentUid()) throw new Error('仅群主可解散');
    await deleteDoc(cref);
  }else{
    const map=Demo.chats(); delete map[chatId]; Demo.setChats(map); Demo.emit('chats',{});
  }
}

/* Comments */
export async function subscribeComments(videoId, cb){
  if(fb){
    const {collection, query, where, orderBy, onSnapshot} = fb;
    const q = query(collection(db,'comments'), where('videoId','==', videoId), orderBy('createdAt','asc'));
    return onSnapshot(q, snap=>{
      const arr = snap.docs.map(d=> ({ id:d.id, ...d.data() }));
      cb(arr);
    });
  }else{
    const render = ()=>{
      const arr = Demo.comments().filter(c=> c.videoId===videoId).sort((a,b)=> a.createdAt-b.createdAt);
      cb(arr);
    };
    const unsub = Demo.on('comments', p=>{ if(p.videoId===videoId) render(); });
    render(); return unsub;
  }
}

export async function addComment({ videoId, parentId, content }){
  if(fb){
    const {collection, addDoc, serverTimestamp} = fb;
    await addDoc(collection(db,'comments'), { videoId, parentId: parentId||null, userId: getCurrentUid(), content, deleted:false, createdAt: serverTimestamp() });
  }else{
    const arr = Demo.comments(); arr.push({ id:String(now()), videoId, parentId: parentId||null, userId:getCurrentUid(), content, deleted:false, createdAt: now() });
    Demo.setComments(arr); Demo.emit('comments',{videoId});
  }
}

export async function deleteComment(commentId){
  if(fb){
    const {doc, getDoc, updateDoc} = fb;
    const cref=doc(db,'comments', commentId); const c=await getDoc(cref);
    if(!c.exists()) return;
    const d=c.data(); if(d.userId !== getCurrentUid()) throw new Error('仅作者可删除');
    await updateDoc(cref, { deleted:true, content:'' });
  }else{
    const arr = Demo.comments(); const it = arr.find(c=> c.id===commentId && c.userId===getCurrentUid());
    if(it){ it.deleted=true; it.content=''; Demo.setComments(arr); Demo.emit('comments',{ videoId: it.videoId }); }
  }
}
