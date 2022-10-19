{
    const ID = 0;
    const title = "Test";
    // Description is showed as tooltip
    const desc = `This is a example, this file represent a exercise declaration 
                    where shows all available functionalities on this framework.`;

    /**
     * Define your customs functions
     * @returns Literally "Hello World"
     */
    function customFunc(){
        return "Hello World";
    }

    /**
     * The arrow function parameter called ex represent a Exercise, and this function is
     * called when the user select this Exercise and run it.
     */
    ExerciseManager.register(ID,'test',desc,(ex)=>{
        //Load a css file located on /exercises/css
        ex.css.load('test');
        //OR insert your custom css rule.
        ex.css.sheet.insertRule(`
            .output::after{
                content: " <<<";
            }                        
        `);
        //Only can insert 1 css rule
        ex.css.sheet.insertRule(`
            .output{
                text-shadow: 1px 0px 2px #fff3;
            }
        `);
        //Inline css rule
        ex.css.sheet.insertRule('.output{color: #a448;}');

        //Creates and return a HTMLElement
        const html = ex.html();
        //Load the view located on "/exercises/view "
        html.load('test',(node)=>{
            node.querySelector(".output").innerText = customFunc();
        });
    });
}


