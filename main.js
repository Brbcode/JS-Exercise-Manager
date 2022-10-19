/**
 * @author Bruno García Trípoli - Brbcode
 * @email brbcode@gmail.com
 * @github git@github.com:Brbcode/JS-Exercise-Manager.git
 */

const ROOT = window.location.href.slice(0,('index.php'.length+1)*-1);

class ExerciseManager{
    static #exercises = [];                   

    static Excercise = class{
        #ID;
        #callback;
        #htmlElement;

        /**
         * 
         * @param {number} ID - Unique id
         * @param {string} title - Title for exercise
         * @param {string} desc - Exercise description.
         * @param {callback} callback - Callback funtion to be trigger on exercise run.
         */
        constructor(ID,title,desc,callback){
            this.#ID=ID;
            this.#htmlElement = undefined;
            this.title = title;
            this.desc = desc.replace(/\s+/gm,' ');
            this.#callback = callback;
        }

        /**
         * Return a HTMLElement wrapper for the exercise, if does not exist, it is created.
         * @returns {HTMLElement}
         */
        html(){
            if(!this.#htmlElement??false){
                const node = document.createElement('div');                
                node.classList.add('exercise');
                node.load = async function(view,onload){
                    const url = ROOT+"exercises/view/"+view+".html";  
                    const response = await fetch(url)
                        .then((data)=>data.text());
                    node.innerHTML = response;
                    
                    if(onload??false)
                        onload(node);
                };
                this.#htmlElement = node;
                document.body.appendChild(this.#htmlElement);
                
            }
            return this.#htmlElement;
        }

        css = new class{
            constructor(){
                var style = document.createElement("style");
                style.id = "dynamic-js";
                document.head.appendChild(style);
                this.sheet = style.sheet;
            }
            
            /**
             * Add a css file to index
             * @param {string} file 
             */
            load(file){
                const url = ROOT+"exercises/css/"+file+".css"; 
                const link = document.createElement('link');
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = url;
                document.head.appendChild(link);
            }
    
        }();

        /**
         * Retrives the id of current exercise.
         * @returns - number
         */
        getID(){return this.#ID;} 

        /**
         * Execute the exercise.
         */
        run(){
            localStorage.setItem('ex-lid',this.getID());
            this.#callback(this);
        }
    };

    /**
     * Holds a HTMLElement that references exercise html selector.
     */
    static selector = (function(){
        const html_id = "exercise-selector";
        const el = document.getElementById(html_id);

        /**
         * Create a html option from specified exercise.
         * @param {ExerciseManager.Exercise} exercise 
         * @returns {void|false}
         */
        el.add = function(exercise){
            if(!exercise instanceof ExerciseManager.Excercise)
                return false;
            const node = document.createElement('option');
            node.value = exercise.getID();
            node.innerText = "• "+exercise.getID()+": "+exercise.title;
            if(exercise.desc??false)
                node.setAttribute('title',exercise.desc);
            
            const lid = localStorage.getItem('ex-lid');                    
            if((lid??false) && exercise.getID()===Number.parseInt(lid))
                node.selected = true;
            ExerciseManager.selector.appendChild(node);
        };
    
        el.addEventListener('change',()=>ExerciseManager.selector.classList.remove("error"));
        return el;
    })();

    /**
     * Holds a HTMLElement that references run button.
     */
    static submit = (function(){
        const html_id = "exercise-run";
        const el = document.getElementById(html_id);  
        el.addEventListener('click',(e)=>{
            e.preventDefault();
            ExerciseManager.selector.classList.remove("error");
            const ID = ExerciseManager.selector.value;
            const exercise = ExerciseManager.get(ID);
            if(exercise??false)  {
                document.getElementById("exercise-selector-wrapper").style.display = 'none';
                exercise.run();
            }   
            else
                ExerciseManager.selector.classList.add("error");
        });

        return el;
    })();   

    /**
     * Holds a HTMLElement that references wait modal.
     */
    static waitModal = (function(){
        const html_id = "wait-wrapper";
        const el = document.getElementById(html_id);   
        el.show = function(){
            el.style.display = '';
        };
        el.hide = function(){
            el.style.display = 'none';
        };
        el.wait = function(status){
            if(status)
                el.show();
            else
                el.hide();
        }
        return el;
    })();

    /**
     * Holds a class that allow to user load scripts located on "/exercises/js/".
     */
    static scripts = new class{
        /**
         * Load all script under path "/exercises/js/"
         * @param {callback} callback - !callback method is called when all script has been 
         * inserted to DOM, NOT when all scripts has been executed.
         */
        async load(callback){
            const url = ROOT+"exercises/js";            
            await fetch(url)
            .then((data) => data.text())
            .then((data) => {                
                data = data.replace('<!DOCTYPE html>','');
                const wrapper = document.createElement('div');
                wrapper.innerHTML = data;
                wrapper.querySelectorAll('ul#files li > a').forEach((el)=>{
                    const href = window.location.origin+el.getAttribute('href');
                    if(href.endsWith('.js'))
                    {                           
                        var script = document.createElement('script');
                        script.src = href;
                        script.defer = true;
                        document.head.appendChild(script);  
                    }                                
                }); 
                if(callback??false)
                    callback();               
            });             
        }
    }();
    

    /**
     * Display or hide wait modal.
     * @param {boolean} status 
     */
    static wait(status){              
        if(status)
            ExerciseManager.waitModal.show();
        else
            ExerciseManager.waitModal.hide();
    }

    /**
     * Private constructor
     */
    constructor(){
        throw "Static class";
    }

    /**
     * Register a new exercise with specified data.
     * @param {number} ID 
     * @param {string} title 
     * @param {string} desc 
     * @throws Exception if exercise with specefied ID already exist.
     */
    static register(ID,title,desc,callback){
        if(ID in ExerciseManager.#exercises)
            throw "Exercise already defined";        
        ExerciseManager.wait(true);
        const exercise = new ExerciseManager.Excercise(ID,title,desc,callback);
        ExerciseManager.#exercises[ID] = exercise;
        ExerciseManager.selector.add(exercise);        
        ExerciseManager.wait(false);     
        return exercise;   
    }

    /**
     * Retrives exercise with specified ID.
     * @param {number} ID 
     * @returns ExerciseManager.Exercise
     * @throws Exception if exercise with specefied ID doesn't exist.
     */
    static get(ID){
        if(!ID in ExerciseManager.#exercises)
            throw `Exercice with id="${ID}" doesn't exist.`;
        return ExerciseManager.#exercises[ID];
    }
}

ExerciseManager.scripts.load();

