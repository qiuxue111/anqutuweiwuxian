
var SUPABASE_URL = "https://hanrfbciinkhgcumvous.supabase.co";
var SUPABASE_ANON_KEY = "sb_publishable_agTUVeYIUF_YtZ_9UZLghA_T6pu8pzG";

var currentUser=null;
var currentTab="pending";

function initAuth(){
  var u=localStorage.getItem("abi_user");
  if(u){try{currentUser=JSON.parse(u);}catch(e){}}
  var hash=window.location.hash;
  if(hash&&hash.indexOf("access_token")>=0){
    var p=new URLSearchParams(hash.replace("#",""));
    var token=p.get("access_token");
    if(token){
      localStorage.setItem("abi_token",token);
      fetch(SUPABASE_URL+"/auth/v1/user",{headers:{"apikey":SUPABASE_ANON_KEY,"Authorization":"Bearer "+token}}).then(function(r){return r.json();}).then(function(u2){
        if(u2&&u2.id&&u2.user_metadata){currentUser=u2;localStorage.setItem("abi_user",JSON.stringify(u2));updateAuthUI();}
      }).catch(function(){});
      initAuthFromToken(token);
    }
    window.location.hash="";
  }
  updateAuthUI();
}
function initAuthFromToken(tok){
  try{
    var parts=tok.split(".");
    if(parts.length!=3)return;
    var raw=atob(parts[1].replace(/-/g,"+").replace(/_/g,"/"));
    var payload=JSON.parse(raw);
    if(payload&&payload.user_metadata){
      currentUser={id:payload.sub,user_metadata:payload.user_metadata};
      localStorage.setItem("abi_user",JSON.stringify(currentUser));
      updateAuthUI();
    }
  }catch(e){}
}
function loginGit(){
  window.location.href=SUPABASE_URL+"/auth/v1/authorize?provider=github&redirect_to="+encodeURIComponent(window.location.href.split("?")[0].split("#")[0]);
}
function logoutGit(){
  currentUser=null;localStorage.removeItem("abi_user");localStorage.removeItem("abi_token");updateAuthUI();
}
function updateAuthUI(){
  var el=document.getElementById("authArea");
  if(!el)return;
  if(currentUser){
    var nm=currentUser.user_metadata&&currentUser.user_metadata.user_name||"已登录";
    var av=currentUser.user_metadata&&currentUser.user_metadata.avatar_url||"";
    el.innerHTML="<img src='"+av+"' style='width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:4px'> <span style='color:#8c8;font-size:13px'>"+nm+"</span> <span onclick='logoutGit()' style='cursor:pointer;color:#e55;font-size:11px;margin-left:6px;background:#2a1a1a;padding:2px 8px;border-radius:4px'>退出</span>";
  }else{
    el.innerHTML="<span onclick='loginGit()' style='cursor:pointer;color:#ffc832;font-size:13px;background:#2a2a10;padding:3px 10px;border-radius:4px;border:1px solid #ffc83244'>GitHub 登录</span>";
  }
}
function checkAuth(){
  if(!currentUser){loginGit();return false;}
  return true;
}
function supabase(t,m,b,q){
  var u=SUPABASE_URL+"/rest/v1/"+t;if(q)u+="?"+q;
  var o={method:m||"GET",headers:{"apikey":SUPABASE_ANON_KEY,"Authorization":"Bearer "+SUPABASE_ANON_KEY,"Content-Type":"application/json","Prefer":"return=representation"}};
  if(b&&m!=="GET")o.body=JSON.stringify(b);
  return fetch(u,o).then(function(r){return r.json();});
}

function getUserId(){
  if(currentUser&&currentUser.id)return currentUser.id;
  var id=localStorage.getItem("abi_user_id");
  if(!id){id="u_"+Date.now()+"_"+Math.random().toString(36).slice(2,8);localStorage.setItem("abi_user_id",id);}
  return id;
}

function switchTab(e,tab){
  currentTab=tab;
  document.querySelectorAll(".tab").forEach(function(t){t.classList.remove("active");});
  e.target.classList.add("active");
  loadData();
}

function loadData(){
  document.getElementById("list").innerHTML="<div class='loading'>加载中...</div>";
  var p=supabase("pending_pins","GET",null,"order=created_at.desc");
  var d=supabase("deletion_requests","GET",null,"order=created_at.desc");
  var pin=supabase("pins","GET",null,"order=created_at.desc");
  Promise.all([p,d,pin]).then(function(res){
    var items=res[0]||[];
    var dels=res[1]||[];
    var pins=res[2]||[];
    if(currentTab==="deletion"){renderDels(dels);return;}
    updateStats(items,dels,pins);
    renderList(items);
  }).catch(function(){
    document.getElementById("list").innerHTML="<div class='empty'>加载失败，请检查网络</div>";
  });
}

function updateStats(items,dels,pins){
  var uid=getUserId();
  var voted=0;
  items.forEach(function(p){if(p.voters&&p.voters.indexOf(uid)>=0)voted++;});
  document.getElementById("sCount").textContent=items.length;
  document.getElementById("vCount").textContent=voted;
  document.getElementById("dCount").textContent=dels.length;
  document.getElementById("tCount").textContent=(pins&&pins.length)||0;
}

function switchTab(e,tab){
  currentTab=tab;
  document.querySelectorAll(".tab").forEach(function(t){t.classList.remove("active");});
  e.target.classList.add("active");
  loadData();
}

function renderList(items){
  var uid=getUserId();
  var html="";
  var filtered=items;
  if(currentTab==="voted"){filtered=items.filter(function(p){return p.voters&&p.voters.indexOf(uid)>=0;});}
  if(filtered.length===0){html="<div class='empty'>没有匹配的项目</div>";}
  filtered.forEach(function(p){
    var hasVoted=p.voters&&p.voters.indexOf(uid)>=0;
    var votes=p.votes||0;
    var isAdmin=localStorage.getItem("abi_is_admin")==="true";
    var now=Date.now();
    var created=new Date(p.created_at||now).getTime();
    var hoursOld=(now-created)/3600000;
    var expired=hoursOld>=24;
    var passed=p.admin_passed||false;
    html+="<div class='card"+(expired?" expired":"")+"'>";
    html+="<div class='hdr'>";
    html+="<img src='"+(p.ic||"")+"' class='icon' onerror="this.style.display='none'">";
    html+="<h3>"+p.name+"</h3>";
    html+=passed?"<span class='badge admin-passed'>已通过</span>":"<span class='badge pending'>待审核</span>";
    if(expired)html+="<span class='badge expired-badge'>已过期</span>";
    if(p.submitter)html+="<span style='color:#888;font-size:11px;margin-left:auto'>提交: "+p.submitter+"</span>";
    html+="</div>";
    html+="<div class='meta'>";
    html+="坐标: <span class='coord' onclick='viewOnMap("+p.x+","+p.y+")'>("+p.x+"%, "+p.y+"%)</span>";
    if(p.note)html+=" | "+p.note;
    html+=" | "+votes+"/10 票";
    if(expired)html+=" | <span style='color:#e55'>已过期</span>";
    html+="</div>";

    // Images if any
    if(p.images&&p.images.length>0){
      html+="<div style='display:flex;gap:6px;margin:6px 0;flex-wrap:wrap'>";
      p.images.forEach(function(img){
        if(img&&img.startsWith("data:"))html+="<img src='"+img+"' style='width:80px;height:80px;object-fit:cover;border-radius:6px;border:1px solid #333;cursor:pointer' onclick='window.open(this.src)'>";
      });
      html+="</div>";
    }

    html+="<div class='actions'>";
    if(!expired){
      if(!hasVoted){
        html+="<button class='btn btn-vote' onclick='vote("+p.id+")'>同意投票 ("+(votes+1)+"/10)</button>";
      }else{
        html+="<button class='btn btn-voted'>已投票</button>";
      }
      if(isAdmin&&!passed){
        html+="<button class='btn btn-pass' onclick='adminPass("+p.id+")'>通过</button>";
        html+="<button class='btn btn-reject' onclick='adminReject("+p.id+")'>拒绝</button>";
      }
    }
    if(isAdmin&&!passed&&!expired){
      html+="<button class='btn btn-del' onclick='userDelete("+p.id+")'>删除此提交</button>";
    }
    html+="</div></div>";
  });
  document.getElementById("list").innerHTML=html;
}

function renderDels(dels){
  var uid=getUserId();
  var html="";
  if(!dels||!dels.length){html="<div class='empty'>没有删除请求</div>";}
  dels.forEach(function(p){
    var hasVoted=p.voters&&p.voters.indexOf(uid)>=0;
    var votes=p.votes||0;
    var isAdmin=localStorage.getItem("abi_is_admin")==="true";
    html+="<div class='card'><div class='hdr'>";
    html+="<span style='color:#e55;font-size:14px'>删除请求</span>";
    html+="<h3>"+p.name+"</h3>"
    if(p.submitted_by)html+="<span style='color:#888;font-size:11px;margin-left:auto'>请求人: "+p.submitted_by+"</span>";
    html+="</div>";
    html+="<div class='meta'>坐标: <span class='coord' onclick='viewOnMap("+p.x+","+p.y+")'>("+p.x+"%, "+p.y+"%)</span>";
    html+=" | "+votes+"/10 票（同意删除）</div>";
    html+="<div class='actions'>";
    if(!hasVoted){
      html+="<button class='btn btn-vote' onclick='voteDelete("+p.id+")'>同意删除 ("+(votes+1)+"/10)</button>";
    }else{
      html+="<button class='btn btn-voted'>已投票</button>";
    }
    if(isAdmin){
      html+="<button class='btn btn-pass' onclick='adminExecDelete("+p.id+","+p.pin_id+")'>执行删除</button>";
      html+="<button class='btn btn-reject' onclick='adminRejectDelete("+p.id+")'>驳回</button>";
    }
    html+="</div></div>";
  });
  document.getElementById("list").innerHTML=html;
}

function vote(id){
  if(!checkAuth())return;
  supabase("pending_pins","GET",null,"id=eq."+id).then(function(items){
    if(!items||!items.length)return;
    var p=items[0];
    var voters=p.voters||[];
    var uid=getUserId();
    if(voters.indexOf(uid)>=0){alert("你已经投过票了");loadData();return;}
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
              supabase("pending_pins","DELETE",null,"id=eq."+id).then(function(){loadData();});
            });
          }
        });
      }else{
        loadData();
      }
    });
  });
}

function voteDelete(id){
  if(!checkAuth())return;
  supabase("deletion_requests","GET",null,"id=eq."+id).then(function(items){
    if(!items||!items.length)return;
    var p=items[0];
    var voters=p.voters||[];
    var uid=getUserId();
    if(voters.indexOf(uid)>=0){alert("你已经投过票了");loadData();return;}
    voters.push(uid);
    var newVotes=(p.votes||0)+1;
    var update={votes:newVotes,voters:voters};
    if(newVotes>=10)update.approved=true;
    supabase("deletion_requests","PATCH",update,"id=eq."+id).then(function(){
      if(newVotes>=10){
        supabase("pins","DELETE",null,"id=eq."+p.pin_id).then(function(){
          supabase("deletion_requests","DELETE",null,"id=eq."+id).then(function(){loadData();});
        });
      }else{
        loadData();
      }
    });
  });
}

function adminPass(id){
  if(!checkAuth())return;
  supabase("pending_pins","GET",null,"id=eq."+id).then(function(items){
    if(!items||!items.length)return;
    var p=items[0];
    supabase("pins","POST",{x:p.x,y:p.y,name:p.name,type:p.type,ic:p.ic,note:p.note||"",images:p.images||[],comments:p.comments||[]}).then(function(){
      supabase("pending_pins","DELETE",null,"id=eq."+id).then(function(){loadData();});
    });
  });
}

function adminReject(id){
  if(!checkAuth())return;
  supabase("pending_pins","DELETE",null,"id=eq."+id).then(function(){loadData();});
}

function adminExecDelete(reqId,pinId){
  if(!checkAuth())return;
  supabase("pins","DELETE",null,"id=eq."+pinId).then(function(){
    supabase("deletion_requests","DELETE",null,"id=eq."+reqId).then(function(){loadData();});
  });
}

function adminRejectDelete(id){
  if(!checkAuth())return;
  supabase("deletion_requests","DELETE",null,"id=eq."+id).then(function(){loadData();});
}

function userDelete(id){
  if(!checkAuth())return;
  supabase("pending_pins","DELETE",null,"id=eq."+id).then(function(){loadData();});
}

function viewOnMap(x,y){
  window.open("map-farm.html?x="+x+"&y="+y,"_blank");
}

function toggleAdmin(){
  var isAdmin=localStorage.getItem("abi_is_admin")==="true";
  if(isAdmin){
    localStorage.setItem("abi_is_admin","false");
    document.getElementById("adminBtn").classList.remove("active");
  }else{
    var pass=prompt("请输入管理员密码");
    if(pass==="admin888"){localStorage.setItem("abi_is_admin","true");document.getElementById("adminBtn").classList.add("active");}else{alert("密码错误");return;}
  }
  loadData();
}

initAuth();loadData();
