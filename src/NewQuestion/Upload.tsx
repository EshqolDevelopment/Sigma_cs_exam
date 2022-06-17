// @ts-nocheck
import React, { useState, useEffect } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { tests, languages, map, args, title} from '../Helper'
import AceEditor from "react-ace";
import * as firebase from '../firebase';
import { getFirestore, doc, updateDoc } from 'firebase/firestore'



export default function Upload() {

    require('./Upload.css')
    const [index, setIndex] = useState(0)
    const [content, setContent] = useState(<div/>)
    const [pre, setPre] = useState(<div/>)
    const [argHtml, setArgHtml] = useState([<div key={'1'}/>])
    const [languagesHtml, setLanguagesHtml] = useState([<div key={'1'}/>])
    const [solution, setSolution] = useState('')
    const [correct, setCorrect] = useState(false)
    const [loading, setLoading] = useState(false)
    // @ts-ignore
    const pyodide = window.pyodide


    const contents = [
        <div>
            <div className={'title'}>
                <h3>Build a custom exam for your interviews</h3>
                <h3>Let's start with the name of the function</h3>
            </div>

            <div className={'input-content'}>
                { getInput('name', "What's the name of this question?", 0, {marginTop: '65px'}) }
            </div>
        </div>,

        <div className={'input-content'}>
            { getInput('subject', "Specify a subject (Strings, Arrays, etc...)", 0) }
            { getInput('level', "How difficult is this question? (Easy, Medium...)", 1) }
            { getInput('outputType', "What the function will return? (int, string...)", 2, {}, false) }
        </div>,

        <div style={{padding: '20px', height: '70%'}} className={'inp'}>
            <textarea id={'in' + 0} defaultValue={map['description']} placeholder={'Write the description for this question'} onChange={(e) => {
                map['description'] = e.target.value
                updatePreview()
            }}/>
            <b style={{width: '94%', left: '3%', marginBottom: '15px'}} id={'line' + 0} className="line"/>
        </div>,

        <div>
            <div className={'title'}>
                <h3>Add arguments (optimal)</h3>
            </div>

            <div className={'input-content'} style={{marginTop: '-20px'}}>
                <div style={{ marginTop: '60px', width: '50%', left: '5%' }} className={'inp'}>
                    <input id={'na'} type="text" placeholder={'Argument name'}/>
                    <b id={'line0'} className="line"/>
                </div>
                <div style={{ marginTop: '60px', width: '50%', left: '5%' }} className={'inp'}>
                    <input id={'ty'} type="text" placeholder={'Argument type'}/>
                    <b id={'line1'} className="line"/>
                </div>
            </div>

            <AiOutlinePlusCircle className={'add'} onClick={add}/>

            <div className={'arguments'}>{argHtml}</div>
        </div>,

        <div>
            <div className={'title'}>
                <h3>Select the languages that the test support</h3>
            </div>

            <div className={'input-content'}>
                <select className="language" id="language">
                    {
                        ['Choose a language', 'Python', 'Kotlin', 'JavaScript', 'C++', 'C', 'C#', 'Java'].map((l, i) => <option key={i} value={l}>{l}</option>)
                    }
                </select>
            </div>

            <AiOutlinePlusCircle style={{top: '44%'}} className={'add'} onClick={addLanguage}/>
            <div className={'arguments'}>{languagesHtml}</div>

        </div>,

        <div>
            <div className={'title'}>
                <h3>Write the solution for this problem in Python</h3>
            </div>

            <div className={'solution-editor'}>
                <AceEditor mode="python" theme="monokai" fontSize={14} highlightActiveLine={false} value={solution || getDefault()} style={{width: '100%', height: '100%'}} onChange={(e) => setSolution(e)}/>
            </div>
        </div>,

        <div>
            <div className={'title'}>
                <h3>Add test cases for the question</h3>
            </div>

            <div className={'input-content'} style={{marginTop: '-20px'}}>
                <div style={{ marginTop: '60px', width: '60%', left: '0' }} className={'inp'}>
                    <input id={'na'} type="text" placeholder={'Input dict'}/>
                    <b id={'line0'} className="line"/>
                </div>
                <div style={{ marginTop: '60px', width: '60%', left: '0' }} className={'inp'}>
                    <input id={'ty'} type="text" placeholder={'Output value for this case'}/>
                    <b id={'line1'} className="line"/>
                </div>
            </div>

            <AiOutlinePlusCircle className={'add'} onClick={addTest}/>
            <h3 id={'pass'} className={'passed'}>{correct}</h3>
        </div>
    ]


    function notEmpty() {
        const name = document.getElementById('na').value
        const type = document.getElementById('ty').value
        const nameLine = document.getElementById('line0')!!
        const typeLine = document.getElementById('line1')!!

        if (name === '') {
            nameLine.style.background = 'red'
            return false
        }

        else
            nameLine.style.background = 'var(--theme)'

        if (type === '') {
            typeLine.style.background = 'red'
            return false
        }

        else typeLine.style.background = 'var(--theme)'

        return [name, type]
    }


    function add() {
        const output = notEmpty()
        if (!output) return

        //@ts-ignore
        document.getElementById('na').value = ''
        //@ts-ignore
        document.getElementById('ty').value = ''

        args[output[0]] = output[1]
        updatePreview()
        updateArgs()
    }


    function addTest() {
        const out = notEmpty()
        if (!out) return

        // @ts-ignore
        const [input, output] = out

        const str = `
func = """${solution}"""

inp = """${input}"""
out = """${output}"""


def validate_output(func: str, inp: str, out: str):
    try:
        func_name = func.strip().split("(")[0][4:]
        exec(func)
        return eval(f"{func_name}(**{inp})") == eval(out)
    except Exception as e:
        return ''

validate_output(func, inp, out)
`
        const res = pyodide.runPython(str)

        const pass = document.getElementById('pass')!!

        setTimeout(() => {
            pass.style.color = 'white'
        }, 3000)

        if (res) {
            pass.style.color = 'green'
            pass.innerText = 'This input was successfully uploaded' //@ts-ignore
            document.getElementById('na').value = '' //@ts-ignore
            document.getElementById('ty').value = ''
            tests[input] = output
            updatePreview()
        }

        else {
            pass.style.color = 'red'
            pass.innerText = 'Incorrect Inputs'
        }

    }


    function updateArgs() {
        const temp = []

        for (const name in args) {
            temp.push(
                <div key={name} className={'arg'}>
                    <p>{name}</p>
                    <img style={{cursor: 'pointer'}} src={"https://cdn-icons-png.flaticon.com/512/1345/1345874.png"}
                         height={20} alt={"remove language"} onClick={() => {

                        delete args[name]
                        updateArgs()
                        updatePreview()
                    }}/>
                </div>
            )
        }
        setArgHtml(temp)
    }


    function addLanguage() {
        // @ts-ignore
        const language = document.getElementById('language').value

        if (language === 'Choose a language') return
        console.log(languages)
        if (languages.indexOf(language) === -1) languages.push(language)
        updateLanguages()
    }


    function updateLanguages() {
        const temp = []

        for (const name in languages) {
            if (languages[name] === '') continue
            temp.push(
                <div key={name} className={'arg'}>
                    <p>{languages[name]}</p>
                    <img style={{cursor: 'pointer'}} src={"https://cdn-icons-png.flaticon.com/512/1345/1345874.png"}
                         height={20} alt={"remove language"} onClick={() => {

                        languages[name] = ''
                        updateLanguages()
                        updatePreview()
                    }}/>
                </div>
            )
        }
        setLanguagesHtml(temp)
    }


    function getInput(name: string, placeholder: string, index: number, style: Record<string, string> = {}, cases: boolean = true) {

        return (
            <div style={style} className={'inp'}>
                <input id={'in' + index} type="text" defaultValue={map[name]} placeholder={placeholder} onChange={(e) => {
                    map[name] = cases ? title(e.target.value) : e.target.value
                    updatePreview()
                }}/>
                <b id={'line' + index} className="line"/>
            </div>
        )
    }


    function plus() {
        let i = 0

        if ([3, 6].includes(index)) return setIndex(i => i + 1)

        while (true) {

            const line = document.getElementById('line' + i)
            if (line === null) break

            // @ts-ignore
            const text = document.getElementById('in' + i).value
            if (text == '') return line.style.backgroundColor = 'red'
            else {
                line.style.backgroundColor = 'var(--theme)'
                i++
            }
        }

        setIndex(i => i + 1)
    }


    function updatePreview() {

        index !== 6 ?
        setPre(
            <div className="preview">
                <div className="preview-top">
                    <h3 className={'preview-title'}>{!map['name'] ? 'Preview' : map['name']}</h3>
                    <h3>{map['level']}</h3>
                    <h3>{map['subject']}</h3>
                </div>

                <div className="preview-bottom">
                    <AceEditor mode="python" theme="monokai" fontSize={16} readOnly={true} highlightActiveLine={false}
                               value={getDefault()} style={{width: '100%', height: '100%'}}/>
                </div>
            </div>
        ) :
        setPre(
            <div className="preview">
                <div className={'preview-args'}>
                    { getTests() }
                </div>
            </div>
        )
    }


    function getDefault() {
        let argsString = ''

        for (const arg in args) {
            argsString += `${arg}: ${args[arg]}, `
        }

        if (argsString.length == 2) argsString = ''
        else argsString = argsString.slice(0, -2)

        const toReturn = map['outputType'] !== '' ? ` -> ${map['outputType']}` : ''

        return map['name'] != '' ? `def ${map['name'].replaceAll(' ', '_').toLowerCase()}(${argsString})${toReturn}:\n  ` : ''
    }


    function getTests() {

        const temp = []

        for (const i in tests) {

            temp.push(
                <div key={i} className={'arg-preview'}>
                    <h4>The input: {i} will return {tests[i]}</h4>
                    <img style={{cursor: 'pointer'}} src={"https://cdn-icons-png.flaticon.com/512/1345/1345874.png"}
                         height={20} alt={"remove language"} onClick={() => {
                        delete tests[i]
                        updatePreview()
                    }}/>
                </div>
            )
        }
        return temp
    }


    function Report() {

        return (
            <div className="report">
                <div className={'title'}>
                    <h2 style={{borderBottom: '3px solid black'}}>Final report for the question "{map['name']}"</h2>
                </div>

                <div className={'report-content'}>
                    <div className={'report-general'}>
                        <h3>Level - {map['level']}</h3>
                        <h3>Subject - {map['subject']}</h3>
                        <h3>The function will return - {map['outputType']}</h3>
                    </div>

                    <p className={'description-report'}>{map['description']}</p>

                    { languages !== [] ? <div className={'report-arguments report-left'}>
                        <h4>Possibles languages: </h4>
                        {
                            languages.map((language, index) => {
                                if (language === '') return
                                return (
                                    <div key={language} className={'arg'}>
                                        <p>{language}</p>
                                    </div>
                                )
                            })
                        }
                    </div> : <div/>}

                    { tests !== {} ? <div className={'report-left'}> {
                        previewMapArray(tests)
                    } </div> : <div/>}

                </div>

                <div className={'report-footer'}>
                    <AceEditor mode="python" theme="monokai" fontSize={16} readOnly={true}
                               highlightActiveLine={false}
                               value={getDefault()} style={{width: '100%', height: '100%'}}/>
                </div>

                <div className={'arrows'}>
                    <BsArrowLeft style={{top: '3%'}} className={'left'} onClick={() => setIndex(i => i + -1)}/>
                </div>

                <button className={'submit-button button-22'} onClick={save}>Submit</button>
            </div>
        )
    }


    useEffect(() => {
        setContent(contents[index])
    }, [index, argHtml, languagesHtml])


    useEffect(() => {
        updatePreview()
    }, [map, index])


    function previewMapArray(ma: Record<string, string>) {
        const temp = []

        for (const i in ma) {
            temp.push(
                <div key={i} className={'arg-preview'}>
                    <h4>The input: {i} will return {tests[i]}</h4>
                </div>
            )
        }

        return temp
    }


    function save() {

        const userId = 'yoav'
        const ref = doc(getFirestore(firebase.app), `${userId}/Questions`)

        const value = JSON.stringify({
                "name": map["name"],
                "subject": map["subject"],
                "level": map["level"],
                "description": map["description"],
                "solution": solution,
                "outputType": map["outputType"],
                "args": JSON.stringify(args),
                "tests": JSON.stringify(tests),
                "languages": languages,
            })

        const data = {}
        const name = map['name']
        // @ts-ignore
        data[name] = value

        setLoading(true)
        updateDoc(ref, data).then(() => setLoading(false))
    }


    return (
        <div className="upload-container">

            { loading && <div className="lds-roller">
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
            </div> }


            {index !== 7 ?
                <div>
                    <div className="upload-box">
                        {content}

                        <div className={'arrows'}>
                            {index !== 0 && <BsArrowLeft className={'left'} onClick={() => setIndex(i => i + -1)}/>}
                            <BsArrowRight className={'right'} onClick={plus}/>
                        </div>
                    </div>

                    <div className={'preview-container'}>
                        {pre}
                    </div>
                </div> :

                <Report/>
            }
        </div>
    )
}


