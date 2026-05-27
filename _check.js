
var TYPES=[
  {cat:"保险箱", items:[
    {id:"safe",name:"保险箱",ic:"../assets/icons/保险.png"},
    {id:"safe2",name:"电子保险",ic:"../assets/icons/电子保险.png"},
    {id:"safe3",name:"滴滴保险",ic:"../assets/icons/滴滴保险.png"},
  ]},
  {cat:"武器箱", items:[
    {id:"weapon",name:"武器箱",ic:"../assets/icons/武器箱.png"},
    {id:"中型武器箱",name:"中型武器箱",ic:"../assets/icons/中型武器箱.png"},
    {id:"largeWeapon",name:"大型武器箱",ic:"../assets/icons/大型武器箱.png"},
    {id:"woodWeapon",name:"木质武器箱",ic:"../assets/icons/木质武器箱.png"},
    {id:"高级武器箱",name:"高级武器箱",ic:"../assets/icons/高级武器箱.png"},
  ]},
  {cat:"工具箱", items:[
    {id:"tool",name:"工具箱",ic:"../assets/icons/工具箱.png"},
    {id:"高级工具箱",name:"高级工具箱",ic:"../assets/icons/高级工具箱.png"},
  ]},
  {cat:"医疗箱", items:[
    {id:"med",name:"小医疗",ic:"../assets/icons/小医疗.png"},
    {id:"中级医疗",name:"中级医疗",ic:"../assets/icons/中级医疗.png"},
    {id:"高级医疗",name:"高级医疗",ic:"../assets/icons/高级医疗.png"},
  ]},
  {cat:"弹药箱", items:[
    {id:"ammo",name:"子弹箱",ic:"../assets/icons/子弹箱.png"},
  ]},
  {cat:"生活箱包", items:[
    {id:"suitcase",name:"旅行箱",ic:"../assets/icons/商务旅行箱.png"},
    {id:"运动包",name:"运动包",ic:"../assets/icons/运动包.png"},
    {id:"白旅",name:"白旅",ic:"../assets/icons/白旅.png"},
    {id:"蓝领",name:"蓝领",ic:"../assets/icons/蓝领.png"},
  ]},
  {cat:"机箱/置物箱", items:[
    {id:"置物箱",name:"置物箱",ic:"../assets/icons/置物箱.png"},
    {id:"黑置物箱",name:"黑置物箱",ic:"../assets/icons/黑置物箱.png"},
    {id:"军用主机",name:"军用主机",ic:"../assets/icons/军用主机.png"},
    {id:"家用机箱",name:"家用机箱",ic:"../assets/icons/家用机箱.png"},
  ]},
  {cat:"衣服", items:[
    {id:"小衣服",name:"小衣服",ic:"../assets/icons/小衣服.png"},
    {id:"大衣",name:"大衣",ic:"../assets/icons/大衣.png"},
  ]},
  {cat:"特殊容器", items:[
    {id:"drawer",name:"抽屉",ic:"../assets/icons/抽屉.png"},
    {id:"文件箱",name:"文件箱",ic:"../assets/icons/文件箱.png"},
    {id:"配件箱",name:"配件箱",ic:"../assets/icons/配件箱.png"},
    {id:"收银机",name:"收银机",ic:"../assets/icons/收银机.png"},
    {id:"手雷箱",name:"手雷箱",ic:"../assets/icons/手雷箱.png"},
    {id:"刮刮乐",name:"刮刮乐",ic:"../assets/icons/刮刮乐.png"},
  ]},
  {cat:"其他", items:[
    {id:"extract",name:"撤离点",ic:"emoji:🚁"},
    {id:"other",name:"其他",ic:"emoji:🏷️"},
  ]}
];
// 平铺所有 item 方便查找
var TYPE={},ALL_ITEMS=[];
TYPES.forEach(function(g){g.items.forEach(function(t){TYPE[t.id]=t;ALL_ITEMS.push(t);});});
var layerSt={};ALL_ITEMS.forEach(function(t){layerSt[t.id]=false;});
var pins=[],curPinIdx=null,mode="view",pp=null,scale=1,panX=0,panY=0,dg=false,dx=0,dy=0,sx=0,sy=0;
var mapComments=[];
var mv=document.getElementById("mv");

function renderLayers(){
  var list=document.getElementById("lp");list.innerHTML="";
  // 全选按钮
  var allOn=true;ALL_ITEMS.forEach(function(t){if(!layerSt[t.id])allOn=false;});
  var al=document.createElement("label");al.className="all-label";
  var ac=document.createElement("input");ac.type="checkbox";ac.checked=allOn;
  ac.onchange=function(){var v=ac.checked;ALL_ITEMS.forEach(function(t){layerSt[t.id]=v;});renderMarkers();renderLayers();};
  al.appendChild(ac);al.appendChild(document.createTextNode(" 全选"));list.appendChild(al);
  // 分组卡片
  TYPES.forEach(function(g){
    var card=document.createElement("div");card.className="ly-card";
    // 组标题 + 组全选
    var hdr=document.createElement("div");hdr.className="ly-card-hdr";
    var hc=document.createElement("input");hc.type="checkbox";
    var gAllOn=true;g.items.forEach(function(t){if(!layerSt[t.id])gAllOn=false;});
    hc.checked=gAllOn;
    hc.onchange=function(){var v=hc.checked;g.items.forEach(function(t){layerSt[t.id]=v;});renderMarkers();renderLayers();};
    var ht=document.createElement("span");ht.textContent=g.cat;
    hdr.appendChild(hc);hdr.appendChild(ht);card.appendChild(hdr);
    // 组内项目
    g.items.forEach(function(t){
      if(layerSt[t.id]===undefined)layerSt[t.id]=false;
      var la=document.createElement("label");
      var cb=document.createElement("input");cb.type="checkbox";cb.checked=layerSt[t.id];
      cb.onchange=(function(id){return function(){layerSt[id]=cb.checked;renderMarkers();};})(t.id);
      la.appendChild(cb);
      var isEmoji=t.ic&&t.ic.indexOf("emoji:")===0;
      if(isEmoji){
        var sp=document.createElement("span");sp.className="ly-icon e";sp.textContent=t.ic.replace("emoji:","");la.appendChild(sp);
      }else{
        var im=document.createElement("img");im.className="ly-icon";im.src=t.ic;la.appendChild(im);
      }
      la.appendChild(document.createTextNode(t.name));card.appendChild(la);
    });
    list.appendChild(card);
  });
}
document.getElementById("lbb").onclick=function(){document.getElementById("lp").classList.toggle("show");renderLayers();};
document.addEventListener("click",function(e){var el=document.getElementById("lp"),btn=document.getElementById("lbb");if(el.classList.contains("show")&&!el.contains(e.target)&&e.target!==btn)el.classList.remove("show");});

function renderMarkers(){
  var box=document.getElementById("mb");
  if(!box){box=document.createElement("div");box.id="mb";box.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none";document.querySelector(".map-wrap img").parentNode.appendChild(box);}
  box.innerHTML="";
  pins.forEach(function(p,i){
    if(layerSt[p.type]===false)return;
    var el=document.createElement("div");
    var td=TYPE[p.type]||{name:p.name,ic:p.ic||"emoji:❓"};
    var ic=td.ic||p.ic;
    var isEmoji=ic&&ic.indexOf("emoji:")===0;
    if(isEmoji){
      el.className="pin-el";el.style.cssText="position:absolute;font-size:18px;transform:translate(-50%,-50%);left:"+p.x+"%;top:"+p.y+"%;pointer-events:auto;cursor:pointer;z-index:10;text-shadow:0 0 4px rgba(0,0,0,.8)";
      el.textContent=ic.replace("emoji:","");
    }else{
      el.className="pin-el";el.style.cssText="position:absolute;background-image:url("+ic+");background-size:cover;background-position:center;background-color:rgba(0,0,0,.4);border:1.5px solid rgba(0,0,0,.6);border-radius:5px;transform:translate(-50%,-50%);left:"+p.x+"%;top:"+p.y+"%;pointer-events:auto;cursor:pointer;z-index:10;box-shadow:0 2px 6px rgba(0,0,0,.5)";el.style.width="28px";el.style.height="28px";
    }
    el.title=p.name;
    el.onclick=(function(idx){return function(e){e.stopPropagation();showPinDetail(idx);};})(i);
    box.appendChild(el);
  });
}

function updateTransform(){
  mv.style.transform="translate("+panX+"px,"+panY+"px) scale("+scale+")";
  var dots=document.querySelectorAll("#mb .pin-el");
  var sz=28/scale;
  dots.forEach(function(el){
    el.style.width=sz+"px";
    el.style.height=sz+"px";
    el.style.fontSize=Math.max(8,20/scale)+"px";
    el.style.borderWidth=Math.max(0.3,1.5/scale)+"px";
    el.style.borderRadius=Math.max(1,5/scale)+"px";
  });
}
function zoom(f){
  var ns=Math.min(8,Math.max(0.2,scale*f));
  if(ns===scale)return;
  var vp=mv.parentElement;
  var cx=vp.clientWidth/2,cy=vp.clientHeight/2;
  var ix=(cx-panX)/scale,iy=(cy-panY)/scale;
  scale=ns;panX=cx-ix*scale;panY=cy-iy*scale;
  updateTransform();
  document.getElementById("zr").value=Math.round(scale*100);
  document.getElementById("zl").textContent=Math.round(scale*100)+"%";
}
function zoomTo(v){
  scale=v/100;panX=0;panY=0;updateTransform();
  document.getElementById("zl").textContent=Math.round(scale*100)+"%";
}
function resetView(){
  scale=1;panX=0;panY=0;updateTransform();
  document.getElementById("zr").value=100;document.getElementById("zl").textContent="100%";
}
document.querySelector(".map-wrap").addEventListener("wheel",function(e){
  e.preventDefault();
  var r=mv.parentElement.getBoundingClientRect();
  var cx=e.clientX-r.left,cy=e.clientY-r.top;
  var ns=scale*(e.deltaY<0?1.1:0.91);
  ns=Math.min(8,Math.max(0.2,ns));
  if(ns===scale)return;
  var ix=(cx-panX)/scale,iy=(cy-panY)/scale;
  scale=ns;panX=cx-ix*scale;panY=cy-iy*scale;
  updateTransform();
  document.getElementById("zr").value=Math.round(scale*100);
  document.getElementById("zl").textContent=Math.round(scale*100)+"%";
},{passive:false});

mv.addEventListener("mousedown",function(e){
  if(e.target.closest(".ly-btn"))return;
  dg=true;dx=e.clientX;dy=e.clientY;sx=panX;sy=panY;mv.style.cursor="grabbing";
});
window.addEventListener("mousemove",function(e){
  if(!dg)return;panX=sx+(e.clientX-dx);panY=sy+(e.clientY-dy);updateTransform();
});
window.addEventListener("mouseup",function(){dg=false;mv.style.cursor="grab";});

mv.addEventListener("click",function(e){
  if(dg||mode!=="contribute")return;
  var r=mv.parentElement.getBoundingClientRect();
  var cx=e.clientX-r.left,cy=e.clientY-r.top;
  var ix=(cx-panX)/scale,iy=(cy-panY)/scale;
  var img=document.getElementById("mapImg");
  pp={x:Math.round(ix/img.clientWidth*1000)/10,y:Math.round(iy/img.clientHeight*1000)/10};
  document.getElementById("cv").textContent=pp.x+"%, "+pp.y+"%";
  document.getElementById("ab").style.display="inline-block";
  showPicker();
});

document.getElementById("mdBtn").onclick=function(){
  var ch=document.getElementById("ch");
  if(mode==="view"){
    mode="contribute";
    document.getElementById("mdBtn").textContent="✏️ 贡献";
    document.getElementById("mdBtn").style.color="#6f6";
    document.getElementById("mdBtn").style.borderColor="rgba(0,255,0,.3)";
    ch.classList.add("show");
    mv.style.cursor="crosshair";
  }else{
    mode="view";
    document.getElementById("mdBtn").textContent="👁️ 浏览";
    document.getElementById("mdBtn").style.color="#ffc832";
    document.getElementById("mdBtn").style.borderColor="rgba(255,200,50,.2)";
    ch.classList.remove("show");
    if(!dg)mv.style.cursor="grab";
  }
};

// 贡献模式鼠标跟随（准星 + 位置显示）
mv.addEventListener("mousemove",function(e){
  if(mode!=="contribute")return;
  var ch=document.getElementById("ch");
  ch.style.left=e.clientX+"px";
  ch.style.top=e.clientY+"px";
  var r=mv.parentElement.getBoundingClientRect();
  var cx=e.clientX-r.left,cy=e.clientY-r.top;
  var img=document.getElementById("mapImg");
  var ix=((cx-panX)/scale)/img.clientWidth*100,iy=((cy-panY)/scale)/img.clientHeight*100;
  document.getElementById("cv").textContent=Math.round(ix*10)/10+"%, "+Math.round(iy*10)/10+"%";
});

function showPicker(){
  // 创建弹出层
  var overlay=document.getElementById("po");
  if(!overlay){
    overlay=document.createElement("div");overlay.id="po";
    overlay.style.cssText="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:9998;padding:16px";
    overlay.innerHTML="<div style='background:#12121a;border:1px solid #1e1e2a;border-radius:14px;width:100%;max-width:600px;max-height:80vh;overflow-y:auto;padding:16px;position:relative;margin:0 0 0 auto;box-shadow:0 8px 32px rgba(0,0,0,.6)'><button onclick='closePicker()' style='position:absolute;top:8px;right:10px;color:#666;font-size:18px;cursor:pointer;background:none;border:none'>X<"+"/button><p style='color:#ffc832;font-size:15px;margin:0 0 4px;text-align:center'>选择容器类型<"+"/p><p id='pc' style='text-align:center;color:#888;font-size:13px;margin-bottom:12px'>位置：<"+"/p><div id='pg' style='display:grid;grid-template-columns:repeat(6,1fr);gap:8px'><"+"/div><"+"/div>";
    document.body.appendChild(overlay);
  }
  document.getElementById("pc").textContent="位置： "+pp.x+"%, "+pp.y+"%";
  var grid=document.getElementById("pg");grid.innerHTML="";
  TYPES.forEach(function(g){
    // 组标题
    var gTitle=document.createElement("div");gTitle.textContent=g.cat;
    gTitle.style.cssText="grid-column:1/-1;color:#ffc832;font-size:13px;font-weight:600;padding:4px 0 2px;border-bottom:1px solid rgba(255,200,50,.15);margin-top:4px";
    grid.appendChild(gTitle);
    g.items.forEach(function(t){
      var it=document.createElement("div");it.style.cssText="display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 3px;background:#0f0f16;border-radius:6px;cursor:pointer;border:2px solid transparent";
      it.onmouseover=function(){this.style.borderColor="#ffc832";this.style.background="#1a1a22";};
      it.onmouseout=function(){this.style.borderColor="transparent";this.style.background="#0f0f16";};
      var isEmoji=t.ic&&t.ic.indexOf("emoji:")===0;
      if(isEmoji){
        var em=document.createElement("div");em.style.cssText="width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:22px";
        em.textContent=t.ic.replace("emoji:","");it.appendChild(em);
      }else{
        var im=document.createElement("img");im.src=t.ic;im.style.cssText="width:36px;height:36px;border-radius:3px;object-fit:cover";it.appendChild(im);
      }
      var lb=document.createElement("div");lb.textContent=t.name;lb.style.cssText="font-size:11px;color:#ccc;text-align:center";it.appendChild(lb);
      it.onclick=function(){addPin(t.id);};
      grid.appendChild(it);
    });
  });
  overlay.style.display="block";
}
function closePicker(){document.getElementById("po").style.display="none";}
function addPin(tid){
  if(!currentUser){login();return;}
  if(!pp)return;
  var sdata={x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[],admin_passed:false,votes:0,voters:[]};
  sdata.submitter=currentUser.user_metadata&&currentUser.user_metadata.user_name||"unknown";
  supabase("pending_pins","POST",sdata).then(function(){
    var el=document.getElementById("ab");
    if(el)el.innerHTML="<span style='color:#9e9;font-size:14px;margin-left:10px'>投稿成功，等待审核<"+LS+">";
    setTimeout(function(){if(el)el.innerHTML="";},3000);
  })["catch"](function(){
    var el=document.getElementById("ab");
    if(el)el.innerHTML="<span style='color:#e99;font-size:14px;margin-left:10px'>投稿失败，请重试<"+LS+">";
    setTimeout(function(){if(el)el.innerHTML="";},3000);
  });
  pins.push({x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[]});
  savePins();renderMarkers();
  pp=null;document.getElementById("cv").textContent="未选择";document.getElementById("ab").style.display="none";closePicker();
}
function savePins(){try{localStorage.setItem("abi_farm_pins",JSON.stringify({pins:pins,mapComments:mapComments}));}catch(e){}}
// --- Supabase cloud ---
var SUPABASE_URL="https://hanrfbciinkhgcumvous.supabase.co";
var SUPABASE_ANON_KEY="sb_publishable_agTUVeYIUF_YtZ_9UZLghA_T6pu8pzG";
f
// --- Supabase Auth ---
var currentUser=null;
var LS="/span";
var L_s="/span";
function initAuth(){
  try{
    var u=localStorage.getItem("abi_user");
    if(u){try{currentUser=JSON.parse(u);}catch(e){}}
    var hash=window.location.hash;
    if(hash&&hash.indexOf("access_token")>=0){
      try{
        var p=new URLSearchParams(hash.replace("#",""));
        var token=p.get("access_token");
        if(token){
          localStorage.setItem("abi_token",token);
          var parts=token.split(".");
          if(parts.length==3){
            var payload=JSON.parse(atob(parts[1]));
            if(payload&&payload.user_metadata){
              currentUser=payload;
              localStorage.setItem("abi_user",JSON.stringify(payload));
            }else if(payload&&payload.sub){
              currentUser={user_metadata:{user_name:payload.sub}};
              localStorage.setItem("abi_user",JSON.stringify(currentUser));
            }
          }
        }
      }catch(e){}
      window.location.hash="";
    }
  }catch(e){}
  updateAuthUI();
}
function login(){
  window.location.href=SUPABASE_URL+"/auth/v1/authorize?provider=github&redirect_to="+encodeURIComponent(window.location.href.split("?")[0].split("#")[0]);
}
function logout(){
  localStorage.removeItem("abi_token");
  localStorage.removeItem("abi_refresh");
  currentUser=null;
  updateAuthUI();
}
function updateAuthUI(){
  var el=document.getElementById("authArea");
  if(!el)return;
  if(currentUser){
    var nm=currentUser.user_metadata&&currentUser.user_metadata.user_name||"已登录";
    var av=currentUser.user_metadata&&currentUser.user_metadata.avatar_url||"";
    el.innerHTML="<img src='"+av+"' style='width:26px;height:26px;border-radius:50%;vertical-align:middle;margin-right:6px'> <span style='color:#8c8;font-size:13px'>"+nm+"</span> <span onclick='logout()' style='cursor:pointer;color:#e55;font-size:12px;margin-left:8px;background:#2a1a1a;padding:2px 8px;border-radius:4px'>退出</span>";
  }else{
    el.innerHTML="<span onclick='login()' style='cursor:pointer;color:#ffc832;font-size:13px;background:#2a2a10;padding:4px 12px;border-radius:4px;border:1px solid #ffc83244'>GitHub 登录</span>";
  }
}
function supabase(t,m,b,q){
  var u=SUPABASE_URL+"/rest/v1/"+t;if(q)u+="?"+q;
  var o={method:m||"GET",headers:{"apikey":SUPABASE_ANON_KEY,"Authorization":"Bearer "+SUPABASE_ANON_KEY,"Content-Type":"application/json","Prefer":"return=representation"}};
  if(b&&m!=="GET")o.body=JSON.stringify(b);
  return fetch(u,o).then(function(r){return r.json();});
}
var cloudPins=[],cloudComments=[];
function loadCloudPins(){
  var a=[];
  a.push(supabase("pins","GET").then(function(d){if(d&&d.length){cloudPins=d;cloudPins.forEach(function(p){delete p.id;delete p.created_at;});}}));
  a.push(supabase("map_comments","GET").then(function(d){if(d&&d.length){cloudComments=d;cloudComments.forEach(function(c){delete c.id;delete c.created_at;});}}));
  Promise.all(a).then(function(){
    pins=cloudPins.slice();
    mapComments=cloudComments.slice();
    savePins();
    renderMarkers();renderMapComments();
  }).catch(function(){
    try{var d=JSON.parse(localStorage.getItem("abi_farm_pins"));if(d){if(d.pins)pins=d.pins;if(d.mapComments)mapComments=d.mapComments;renderMarkers();renderMapComments();}}catch(e){}
  });
}

// ─── 容器详情弹窗 ───
function showPinDetail(idx){
  curPinIdx=idx;
  var p=pins[idx];
  document.getElementById("pdTitle").innerHTML="<img src='"+(p.ic||"")+"' style='width:28px;height:28px;border-radius:4px;object-fit:cover'> "+p.name;
  document.getElementById("pdCoord").textContent="位置： "+p.x+"%, "+p.y+"%";
  document.getElementById("pdNote").value=p.note||"";
  renderPinImages();
  renderPinComments();
  document.getElementById("pd").classList.add("show");
}
function closePinDetail(){document.getElementById("pd").classList.remove("show");curPinIdx=null;}
function savePinNote(){
  if(curPinIdx===null)return;
  pins[curPinIdx].note=document.getElementById("pdNote").value;
  savePins();
}
function renderPinImages(){
  var grid=document.getElementById("pdImgGrid");grid.innerHTML="";
  if(curPinIdx===null)return;
  var imgs=pins[curPinIdx].images||[];
  imgs.forEach(function(src,i){
    var img=document.createElement("img");img.src=src;
    img.onclick=function(){var r=confirm("删除此图片？");if(r){pins[curPinIdx].images.splice(i,1);savePins();renderPinImages();}};
    grid.appendChild(img);
  });
  var addBtn=document.createElement("div");addBtn.className="pd-add-img";addBtn.textContent="+";
  addBtn.onclick=function(){document.getElementById("pdImgInput").click();};
  grid.appendChild(addBtn);
}
function addPinImages(files){
  if(curPinIdx===null||!files.length)return;
  for(var i=0;i<files.length;i++){
    (function(file){
      var reader=new FileReader();
      reader.onload=function(e){
        pins[curPinIdx].images.push(e.target.result);
        if(i===files.length-1){savePins();renderPinImages();}
      };
      reader.readAsDataURL(file);
    })(files[i]);
  }
}
function deleteCurrentPin(){
  if(!currentUser){login();return;}
  if(curPinIdx===null)return;
  var p=pins[curPinIdx];
  if(!confirm("确认提交删除申请？其他人将可以对此投票。"))return;
  if(p.id){
    supabase("deletion_requests","POST",{pin_id:p.id,name:p.name,type:p.type,x:p.x,y:p.y,reason:"用户提交",votes:0,voters:[]});
  }
  pins.splice(curPinIdx,1);curPinIdx=null;
  savePins();renderMarkers();closePinDetail();
}

// ─── 容器点位评论区 ───
function renderPinComments(){
  var list=document.getElementById("pdcList");list.innerHTML="";
  if(curPinIdx===null)return;
  var comments=pins[curPinIdx].comments||[];
  comments.forEach(function(c){
    var item=document.createElement("div");item.className="pdc-item";
    var time=document.createElement("span");time.className="pdc-time";time.textContent=c.time;
    var text=document.createElement("span");text.textContent=c.text;
    item.appendChild(text);item.appendChild(time);list.appendChild(item);
  });
}
function postPinComment(){
  if(curPinIdx===null)return;
  var input=document.getElementById("pdcInput");
  var text=input.value.trim();
  if(!text)return;
  var now=new Date();
  var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});
  var p=pins[curPinIdx];
  if(p.id){
    supabase("map_comments","POST",{pin_type:p.type,pin_x:p.x,pin_y:p.y,text:text,time:tz});
  }
  p.comments.push({text:text,time:tz});
  savePins();renderPinComments();
  input.value="";
}

// ─── 地图评论区 ───
function renderMapComments(){
  var list=document.getElementById("mcList");list.innerHTML="";
  mapComments.forEach(function(c){
    var item=document.createElement("div");item.className="mc-item";
    var time=document.createElement("span");time.className="mc-time";time.textContent=c.time;
    var text=document.createElement("span");text.textContent=c.text;
    item.appendChild(text);item.appendChild(time);list.appendChild(item);
  });
}
function postMapComment(){
  var input=document.getElementById("mcInput");
  var text=input.value.trim();
  if(!text)return;
  var now=new Date();
  var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});
  supabase("map_comments","POST",{pin_type:"map",pin_x:0,pin_y:0,text:text,time:tz});
  mapComments.push({text:text,time:tz});
  savePins();renderMapComments();
  input.value="";
}

initAuth();loadCloudPins();updateAuthUI();
