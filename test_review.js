
var SUPABASE_URL = "https://hanrfbciinkhgcumvous.supabase.co";
var SUPABASE_ANON_KEY = "sb_publishable_agTUVeYIUF_YtZ_9UZLghA_T6pu8pzG";

f
// Auth
var currentUser=null;
var SP="/span";
var A="/a";
function initAuth(){
  var u=localStorage.getItem("abi_user");
  if(u){try{currentUser=JSON.parse(u);}catch(e){}}
  var hash=window.location.hash;
  var p=new URLSearchParams(hash.replace("#",""));
  var token=p.get("access_token");
  if(token){
    localStorage.setItem("abi_token",token);
    var meta=p.get("user_metadata");
    if(meta){try{var md=JSON.parse(meta);currentUser=md;}catch(e){}}
    if(currentUser)localStorage.setItem("abi_user",JSON.stringify(currentUser));
    window.location.hash="";
  }
  updateAuthUI();
}
function loginGit(){
  window.location.href="https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to="+encodeURIComponent(window.location.href.split("?")[0].split("#")[0]);
}
function logoutGit(){
  currentUser=null;
  localStorage.removeItem("abi_user");
  localStorage.removeItem("abi_token");
  updateAuthUI();
}
function checkAuth(){
  if(!currentUser){loginGit();return false;}
  return true;
}
function updateAuthUI(){
  var el=document.getElementById("authBar");
  if(!el)return;
  if(currentUser){
    var nm=currentUser.user_metadata&&currentUser.user_metadata.user_name||"已登录";
    el.innerHTML='<span style="color:#8c8">'+nm+'<'+SP+'> <a href="javascript:logoutGit()" style="color:#e55;font-size:12px">退出<'+A+'>';
  }else{
    el.innerHTML='<a href="javascript:loginGit()" style="color:#ffc832;font-size:13px">GitHub 登录<'+A+'>';
  }
}
function supabase(t,m,b,q){
  var u=SUPABASE_URL+"/rest/v1/"+t;if(q)u+="?"+q;
  var o={method:m||"GET",headers:{"apikey":SUPABASE_ANON_KEY,"Authorization":"Bearer "+SUPABASE_ANON_KEY,"Content-Type":"application/json","Prefer":"return=representation"}};
  if(b&&m!=="GET")o.body=JSON.stringify(b);
  return fetch(u,o).then(function(r){return r.json();});
}

function getUserId(){
  var id=localStorage.getItem("abi_user_id");
  if(!id){id="u_"+Date.now()+"_"+Math.random().toString(36).slice(2,8);localStorage.setItem("abi_user_id",id);}
  return id;
}

var currentTab="pending";

function switchTab(e,tab){
  currentTab=tab;
  document.querySelectorAll(".tab").forEach(function(t){t.classList.remove("active");});
  e.target.classList.add("active");
  initAuth();loadPending();
}

function loadPending(){
  document.getElementById("list").innerHTML="<div class='loading'>"+LS+"...<"+LS+"div>";
  var p=supabase("pending_pins","GET",null,"order=created_at.desc");
  var d=supabase("deletion_requests","GET",null,"order=created_at.desc");
  Promise.all([p,d]).then(function(res){
    var items=res[0]||[];
    var dels=res[1]||[];
    if(currentTab==="deletion"){
      renderDeletionList(dels);return;
    }
    updateStats(items);
    renderList(items);
  })["catch"](function(){
    document.getElementById("list").innerHTML="<div class='empty'>"+FL+"<"+LS+"div>";
  });
}

function updateStats(items){
  var uid=getUserId();
  var total=items.length;
  var voted=0;
  items.forEach(function(p){if(p.voters&&p.voters.indexOf(uid)>=0)voted++;});
  document.getElementById("scount").textContent=total;
  document.getElementById("vcount").textContent=voted;
  supabase("pins","GET").then(function(pin){document.getElementById("ccount").textContent=(pin&&pin.length)||0;})["catch"](function(){});
}

function renderDeletionList(dels){
  var uid=getUserId();
  var html="";
  if(!dels||!dels.length){html="<div class='empty'>"+NE+"<"+LS+"div>";document.getElementById("list").innerHTML=html;return;}
  dels.forEach(function(p){
    var hasVoted=p.voters&&p.voters.indexOf(uid)>=0;
    var votes=p.votes||0;
    var isAdmin=localStorage.getItem("abi_is_admin")==="true";
    html+="<div class='card'>";
    html+="<h3><span style='color:#e55'>"+DT+"<"+LS+"span> "+p.name+"<"+LS+"h3>";
    html+="<div class='meta'>"+CORD+" ("+p.x+"%, "+p.y+"%) | "+votes+"/10 "+DV+"<"+LS+"div>";
    html+="<div class='actions'>";
    if(!hasVoted){
      html+="<button class='btn btn-vote' onclick='voteDelete("+p.id+")'>"+AGREE+" ("+(votes+1)+"/10)<"+LS+"button>";
    }else{
      html+="<button class='btn btn-voted'>"+VOTED+"<"+LS+"button>";
    }
    if(isAdmin){
      html+="<button class='btn btn-pass' onclick='adminExecDelete("+p.id+","+p.pin_id+")'>"+EXEC_DEL+"<"+LS+"button>";
      html+="<button class='btn btn-reject' onclick='adminRejectDelete("+p.id+")'>"+REJECT+"<"+LS+"button>";
    }
    html+="<"+LS+"div><"+LS+"div>";
  });
  document.getElementById("list").innerHTML=html;
}

function renderList(items){
  var uid=getUserId();
  var html="";
  var filtered=items;
  if(currentTab==="voted"){filtered=items.filter(function(p){return p.voters&&p.voters.indexOf(uid)>=0;});}
  if(filtered.length===0){html="<div class='empty'>"+NE+"<"+LS+"div>";}
  filtered.forEach(function(p){
    var hasVoted=p.voters&&p.voters.indexOf(uid)>=0;
    var votes=p.votes||0;
    var isAdmin=localStorage.getItem("abi_is_admin")==="true";
    var now=Date.now();
    var created=new Date(p.created_at||now).getTime();
    var hoursOld=(now-created)/3600000;
    var expired=hoursOld>=24;
    html+="<div class='card"+(expired?" card-expired":"")+"'>";
    html+="<h3>"+(p.ic&&p.ic.indexOf("emoji:")===0?p.ic.replace("emoji:",""):"<img src='"+p.ic+"' style='width:18px;height:18px;border-radius:3px;vertical-align:middle'>")+" "+p.name+"<"+LS+"h3>";
    html+="<div class='meta'>"+CORD+" ("+p.x+"%, "+p.y+"%)";
    if(p.note)html+=" | "+p.note;
    html+=" | "+votes+"/10 "+TICK;
    if(expired)html+=" | <span style='color:#e55'>"+EXP+"<"+LS+"span>";
    if(p.admin_passed)html+=" | "+ADMIN_OK;
    html+="<"+LS+"div>";
    html+="<div class='actions'>";
    if(!expired){
      if(!hasVoted){
        html+="<button class='btn btn-vote' onclick='vote("+p.id+")'>"+AGREE+" ("+(votes+1)+"/10)<"+LS+"button>";
      }else{
        html+="<button class='btn btn-voted'>"+VOTED+"<"+LS+"button>";
      }
      if(isAdmin&&!p.admin_passed){
        html+="<button class='btn btn-pass' onclick='adminPass("+p.id+")'>"+PASS+"<"+LS+"button>";
        html+="<button class='btn btn-reject' onclick='adminReject("+p.id+")'>"+REJECT+"<"+LS+"button>";
      }
    }
    html+="<button class='btn btn-del' onclick='userDelete("+p.id+")'>"+DELETE+"<"+LS+"button>";
    html+="<"+LS+"div><"+LS+"div>";
  });
  document.getElementById("list").innerHTML=html;
}

function vote(id){if(!checkAuth())return;
  supabase("pending_pins","GET",null,"id=eq."+id).then(function(items){
    if(!items||!items.length)return;
    var p=items[0];
    var voters=p.voters||[];
    var uid=getUserId();
    if(voters.indexOf(uid)>=0){alert(ALREADY_VOTED);initAuth();loadPending();return;}
    voters.push(uid);
    var newVotes=(p.votes||0)+1;
    var shouldPass=newVotes>=10;
    var update={votes:newVotes,voters:voters};
    if(shouldPass)update.admin_passed=true;
    supabase("pending_pins","PATCH",update,"id=eq."+id).then(function(){
      if(shouldPass){
        supabase("pending_pins","GET",null,"id=eq."+id).then(function(approved){
          if(approved&&approved.length){
            var a=approved[0];
            supabase("pins","POST",{x:a.x,y:a.y,name:a.name,type:a.type,ic:a.ic,note:a.note||"",images:a.images||[],comments:a.comments||[]}).then(function(){
              supabase("pending_pins","DELETE",null,"id=eq."+id).then(function(){initAuth();loadPending();});
            });
          }
        });
      }else{
        initAuth();loadPending();
      }
    });
  });
}

function voteDelete(id){if(!checkAuth())return;
  supabase("deletion_requests","GET",null,"id=eq."+id).then(function(items){
    if(!items||!items.length)return;
    var p=items[0];
    var voters=p.voters||[];
    var uid=getUserId();
    if(voters.indexOf(uid)>=0){alert(ALREADY_VOTED);initAuth();loadPending();return;}
    voters.push(uid);
    var newVotes=(p.votes||0)+1;
    var update={votes:newVotes,voters:voters};
    if(newVotes>=10)update.approved=true;
    supabase("deletion_requests","PATCH",update,"id=eq."+id).then(function(){
      if(newVotes>=10){
        supabase("pins","DELETE",null,"id=eq."+p.pin_id).then(function(){
          supabase("deletion_requests","DELETE",null,"id=eq."+id).then(function(){initAuth();loadPending();});
        });
      }else{
        initAuth();loadPending();
      }
    });
  });
}

function adminPass(id){if(!checkAuth())return;
  if(!confirm(CONFIRM_PASS))return;
  supabase("pending_pins","GET",null,"id=eq."+id).then(function(items){
    if(!items||!items.length)return;
    var p=items[0];
    supabase("pins","POST",{x:p.x,y:p.y,name:p.name,type:p.type,ic:p.ic,note:p.note||"",images:p.images||[],comments:p.comments||[]}).then(function(){
      supabase("pending_pins","DELETE",null,"id=eq."+id).then(function(){initAuth();loadPending();});
    });
  });
}

function adminReject(id){if(!checkAuth())return;
  if(!confirm(CONFIRM_REJECT))return;
  supabase("pending_pins","DELETE",null,"id=eq."+id).then(function(){initAuth();loadPending();});
}

function adminExecDelete(reqId,pinId){if(!checkAuth())return;
  if(!confirm(CONFIRM_EXEC_DEL))return;
  supabase("pins","DELETE",null,"id=eq."+pinId).then(function(){
    supabase("deletion_requests","DELETE",null,"id=eq."+reqId).then(function(){initAuth();loadPending();});
  });
}

function adminRejectDelete(id){if(!checkAuth())return;
  if(!confirm(CONFIRM_REJECT_DEL))return;
  supabase("deletion_requests","DELETE",null,"id=eq."+id).then(function(){initAuth();loadPending();});
}

function userDelete(id){if(!checkAuth())return;
  if(!confirm(CONFIRM_USER_DEL))return;
  supabase("pending_pins","DELETE",null,"id=eq."+id).then(function(){initAuth();loadPending();});
}

function toggleAdmin(){
  var isAdmin=localStorage.getItem("abi_is_admin")==="true";
  if(isAdmin){
    localStorage.setItem("abi_is_admin","false");
  }else{
    var pass=prompt(ADMIN_PROMPT);
    if(pass==="admin888"){localStorage.setItem("abi_is_admin","true");}else{alert(ADMIN_FAIL);return;}
  }
  initAuth();loadPending();
}

// Text constants (avoid </ in JS strings)
var LS = "/div";
var DT = "删除请求";
var CORD = "坐标:";
var DV = "票（同意删除）";
var AGREE = "同意";
var VOTED = "已投票";
var EXEC_DEL = "执行删除";
var REJECT = "驳回";
var NE = "没有匹配的项目";
var FL = "加载失败，请检查网络";
var TICK = "票";
var EXP = "已过期（超过24小时）";
var ADMIN_OK = "管理员已通过";
var PASS = "通过";
var DELETE = "删除此提交";
var ALREADY_VOTED = "\\u4F60\\u5DF2\\u7ECF\\u6295\\u8FC7票\\u4E86";
var CONFIRM_PASS = "\\u786E\\u8BA4\\u76F4\\u63A5通过\\u8FD9\\u4E2A\\u70B9\\u4F4D\\uFF1F";
var CONFIRM_REJECT = "确认拒绝这个点位？会永久删除！";
var CONFIRM_EXEC_DEL = "确认删除这个点位？";
var CONFIRM_REJECT_DEL = "驳回\\u5220\\u9664\\u8BF7\\u6C42\\uFF1F";
var CONFIRM_USER_DEL = "确认删除这条提交？";
var ADMIN_PROMPT = "请输入管理员密码";
var ADMIN_FAIL = "密码错误";

initAuth();loadPending();
