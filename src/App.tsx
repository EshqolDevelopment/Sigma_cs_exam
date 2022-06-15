import React from 'react';
import './App.css';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {
  return (
    <div className="App">

        <div className={"content"}>

            <div className={"send"} id={"send"}>

                <h3 className={"center-text title"}>Build a custom test for your interviewers</h3>

                <br/><br/>

                <form>
                    <div className={"form-group1"}>
                        <input placeholder={"Names and args"} type={"text"} required={true}/>
                        <input placeholder={"Level"} type={"text"}/>
                        <input placeholder={"Subject"} type={"text"} required={true}/>
                        <input placeholder={"Time (minutes)"} type={"number"} required={true}/>
                    </div>

                    <div className={"form-group2"}>
                        <textarea placeholder={"Description"}  required={true}/>
                        <p>Add an image (optimal)</p>
                        <input type={"file"}/>
                        <textarea placeholder={"Inputs"}  required={true}/>
                        <textarea placeholder={"Outputs"}  required={true}/>

                        <br/>
                        <label htmlFor="cars">Solution language:</label>

                        <select name="language" id="language">
                            <option value="Python">Python</option>
                            <option value="Java Script">Java Script</option>
                            <option value="Java">Java</option>
                            <option value="Kotlin">Kotlin</option>
                        </select>

                        {/*<textarea placeholder={"Solution"} required={true}/>*/}

                        <div className={"editor1"}>
                            <AceEditor
                                width={'100%'}
                                height={"25vh"}
                                mode="python"
                                theme="xcode"
                                onChange={onChange}
                                name="UNIQUE_ID_OF_DIV"
                                editorProps={{ $blockScrolling: true }}
                            />,
                        </div>


                        <button>Add Question</button>
                    </div>

                </form>
            </div>

            <div className={'resize'} id={'resize'}/>

            <div className={"preview"}>
                <h3 className={"title"}>Here you can see the preview of the current question</h3>
                <br/><br/><br/><br/>

                <button>Create Test</button>
            </div>


        </div>

    </div>
  );
}

export default App;
