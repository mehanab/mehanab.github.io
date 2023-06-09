//Config

let config = {
    timeOut : null
}

// Class to write
class WritingInterval {
    constructor(element) {
        this.element = element;
        this.tabOfstringToWrite = [];
        this.setTimeIntervalId = null;
        this.run = 0;
    }
    
    finish() {
        clearInterval(this.setTimeIntervalId);
        this.setTimeIntervalId = null;
    }

    setDisplay()
    {
        this.tabOfstringToWrite = this.element.innerText.split('');
        this.element.innerText = "";
        this.element.style.display = "block";
        //create span
        let span = document.createElement('span');
        span.className  = "cursor";
        span.innerHTML = "_";
        span.style.fontSize = "larger"
        this.element.appendChild(span);
        
    }
    start(){
        this.setTimeIntervalId = setInterval(()=> {
            if(this.run >= this.tabOfstringToWrite.length) 
            {
                this.finish();
            }else 
            {
                let span = this.element.getElementsByClassName('cursor')[0];
                if(span)
                {
                    span.remove();
                }
                
                this.element.innerHTML = this.element.innerHTML+ this.tabOfstringToWrite[this.run]
                 + span.outerHTML;
                 this.run++;
            }
        }, 40);
    }
}

class layoutCascade
{
    constructor(element)
    {
        this.nodes = element;
        this.count = element.length;
    }

    setClass = (event) =>
    {
        if (this.count > 0) 
        {
            for(let item of this.nodes)
            {   
                if(item.offsetTop <= window.scrollY + (window.innerHeight - 150))
                {     
                    if(item.classList.contains("slide_cascade_out"))
                    {
                        item.classList.replace("slide_cascade_out", "slide_cascade_in")
                        this.count-=1;
                    }                 
                }  
            }
        }
        else 
        {
            return document.removeEventListener("scroll", this.setClass);     
        }
    }

    setHandler()
    {
        return document.addEventListener("scroll", this.setClass);
    } 
}

class setAnnouncer
{
    constructor(element) {
        this.element = element;
    }
    
    setStyle() 
    {
        if (this.element instanceof HTMLCollection) 
        {
            for(let item of this.element)
            {
                item.style.strokeDashoffset = 1;
            }
            
        }else{
            this.element.style.strokeDashoffset = 1;
        }
    }

    setListener()
    {
        if (this.element instanceof HTMLCollection) 
        {
            window.addEventListener("load", (event) => {
                for(let item of this.element)
                {
                    item.style.strokeDashoffset = 0;
                }  
            }, {once: true});

        }else{
            this.element.style.strokeDashoffset = 0;
        }
    }
}

function mobilecheck() {
    return (typeof window.orientation !== "undefined") 
      || (navigator.userAgent.indexOf('IEMobile') !== -1
      );
};

function docReady() {
    // see if DOM is already available
    let docState = document.readyState;
    if (docState == "complete" || docState == "interactive") {

        let announcer_filled = document.getElementsByClassName("announcer_filled");
        let announcer = new setAnnouncer(announcer_filled);
        announcer.setStyle();
        announcer.setListener();

        setTimeout(()=>{

            let svg_container = document.getElementById("by_announcer_content");
            svg_container.style.transition = "all 1s ease";
            if (!mobilecheck()) {
                svg_container.style.transform = "rotate(3turn) translate(-100%, -100%) scale(0)";   
            }
            

            let by_announcer = document.getElementById("by_announcer");
            // by_announcer.style.transform= "translate(-100%, -100%)";
            by_announcer.style.opacity= "0";

            let container = document.getElementById("container");
            container.style.display ="block"

            
            let div = document.getElementById("main-content");
            let writeBonjour = new WritingInterval(div.getElementsByTagName('h2')[0]);
            let writePresentation = new WritingInterval(div.getElementsByTagName('h3')[0]);
            let writeProf = new WritingInterval(div.getElementsByTagName('p')[0]);

    
            setTimeout(()=>{
                writeBonjour.setDisplay();
                writeBonjour.start();
                setTimeout(()=>{
                    writePresentation.setDisplay();
                    writePresentation.start(); 
                    setTimeout(()=>{
                        by_announcer.style.display= "none";
                        writeProf.setDisplay();
                        writeProf.start(); 
                    },  2000);
                },  500);
                 
            }, 1000);
            //Scroll 1px pour provoquer l'event "scroll" plus bas
            window.scrollBy(0, 1)
        }, 3000);


        let resume = document.getElementById("resume_file");
        resume.addEventListener('click', (e)=>{
            e.preventDefault();
            window.open('./Resume/resume.pdf')
        })

        let scroll_pos = 0;
        let nav = document.getElementById("nav");
        document.addEventListener("scroll", (e)=>{
            if (window.scrollY == 0) {
                scroll_pos = 0
                nav.classList.remove("slide-nav-in");
            }
           
            if(scroll_pos == 0)
            {
                if (window.scrollY > 60) {
                    nav.classList.add("slide-nav-out")
                    scroll_pos = window.scrollY;
                }
            }
            else
            {
                if (window.scrollY < scroll_pos) 
                {
                    nav.classList.remove("slide-nav-out")
                    nav.classList.add("slide-nav-in")
                    scroll_pos = window.scrollY;
                }else if(window.scrollY > scroll_pos)
                {
                    nav.classList.remove("slide-nav-in")
                    nav.classList.add("slide-nav-out")
                    scroll_pos = window.scrollY;
                }
            }  
        })
        
        let layout = new layoutCascade(document.getElementsByClassName("slide_cascade_out"));
        layout.setHandler();


        let bur = document.getElementById("nav-content")
        bur.addEventListener("click", function(){
            if(bur.classList.contains("nav-content-bur"))
            {
                bur.classList.replace("nav-content-bur", "nav-content-cross") 
            }else if(bur.classList.contains("nav-content-cross"))
            {
                bur.classList.replace("nav-content-cross", "nav-content-bur") 
            }
        })
    }
    else {
        document.addEventListener("DOMContentLoaded", ()=>{ docReady()});
    }
}   
docReady();