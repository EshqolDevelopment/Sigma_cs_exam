import React, { useState, useEffect } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { languages, map, args, title} from './Helper'
import AceEditor from "react-ace";



export default function Upload() {

    require('./Upload.css')
    const [index, setIndex] = useState(0)
    const [content, setContent] = useState(<div/>)
    const [pre, setPre] = useState(updatePreview)
    const [argHtml, setArgHtml] = useState([<div/>])
    const [languagesHtml, setLanguagesHtml] = useState([<div/>])
    const [solution, setSolution] = useState('')

    const contents = [
        <div>
            <div className={'title'}>
                <h3>Build a custom exam for your interviews</h3>
                <h3>Let's start with the name of the function</h3>
            </div>

            <div className={'input-content'}>
                { getInput('name', "What's the name of this question?", 0, {marginTop: '40px'}) }
                { getInput('outputType', "What the function will return?", 1, {marginTop: '40px'}, false) }
            </div>
        </div>,

        <div className={'input-content'}>
            { getInput('subject', "Specify a subject (Strings, Arrays, etc...)", 0) }
            { getInput('level', "How difficult is this question? (Easy, Medium...)", 1) }
            { getInput('time', "Set the time limit for this question (seconds)", 1) }
        </div>,

        <div style={{padding: '20px', height: '70%'}} className={'inp'}>
            <textarea id={'in' + 0} defaultValue={map['description']} placeholder={'Write the description for this question'} onChange={(e) => map['description'] = e.target.value}/>
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
                <AceEditor mode="python" theme="monokai" fontSize={14} highlightActiveLine={false} value={getDefault()} style={{width: '100%', height: '100%'}} onChange={(e) => setSolution(e)}/>
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

            <AiOutlinePlusCircle className={'add'} onClick={add}/>

            <div className={'arguments'}>{argHtml}</div>
        </div>
        
    ]


    function add() {

        // @ts-ignore
        const name = document.getElementById('na').value
        // @ts-ignore
        const type = document.getElementById('ty').value
        const nameLine = document.getElementById('line0')!!
        const typeLine = document.getElementById('line1')!!
        
        if (name === '')
            return nameLine.style.background = 'red'
        else
            nameLine.style.background = 'var(--theme)'

        if (type === '')
            return typeLine.style.background = 'red'
        else
            typeLine.style.background = 'var(--theme)'

        //@ts-ignore
        document.getElementById('na').value = ''
        //@ts-ignore
        document.getElementById('ty').value = ''

        args[name] = type
        setPre(updatePreview)

        updateArgs()
    }


    function updateArgs() {
        const temp = []

        for (const name in args) {
            temp.push(
                <div className={'arg'}>
                    <p>{name}</p>
                    <img style={{cursor: 'pointer'}} src={"https://cdn-icons-png.flaticon.com/512/1345/1345874.png"}
                         height={20} alt={"remove language"} onClick={() => {

                        delete args[name]
                        updateArgs()
                        setPre(updatePreview)

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
                <div className={'arg'}>
                    <p>{languages[name]}</p>
                    <img style={{cursor: 'pointer'}} src={"https://cdn-icons-png.flaticon.com/512/1345/1345874.png"}
                         height={20} alt={"remove language"} onClick={() => {

                        languages[name] = ''
                        updateLanguages()
                        setPre(updatePreview)

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
                    setPre(updatePreview)
                }}/>
                <b id={'line' + index} className="line"/>
            </div>
        )
    }


    function plus() {
        let i = 0
        if (index === 3) return setIndex(i => i + 1)

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
        setPre(updatePreview)
    }


    function updatePreview() {

        const code = getDefault()

        return (
            <div className="preview">
                <div className="preview-top">
                    <h3 className={'preview-title'}>{!map['name'] ? 'Preview' : map['name']}</h3>
                    <h3 className={'level'}>{map['level']}</h3>
                    <h3 className={'subject'}>{map['subject']}</h3>
                    <h3 className={'time'}>{!map['time'] ? '': map['time'] + ' Seconds'}</h3>
                </div>

                <div className="preview-bottom">
                    <AceEditor mode="python" theme="monokai" fontSize={16} readOnly={true} highlightActiveLine={false}
                               value={code} style={{width: '100%', height: '100%'}}/>
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

        const toReturn = map['outputType'] !== '' ? `${map['outputType']}` : ''

        return map['name'] != '' ? `def ${map['name'].replaceAll(' ', '_').toLowerCase()}(${argsString}) -> ${toReturn}:\n` : ''
    }


    useEffect(() => {
        setContent(contents[index])
    }, [index, argHtml, languagesHtml])


    return (
        <div className="upload-container">
            <div className="upload-box">
                {content}

                <div className={'arrows'}>
                    { index !== 0 && <BsArrowLeft className={'left'} onClick={() => setIndex(i => i + -1)}/> }
                    <BsArrowRight className={'right'} onClick={plus}/>
                </div>
            </div>

            { pre }
        </div>
    )
}