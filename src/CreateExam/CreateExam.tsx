import React, { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";



const map: Record<string, string|number|any[]> = {
    'name': '',
    'description': '',
    'questions': [],
    'duration': '',
    'passingScore': '',
    'password': '',
}


export default function CreateExam() {

    require('./CreateExam.css')
    const [index, setIndex] = useState(0)


    const content = [
        <div>
            <h3 className={'title-create-exam'}>Create a custom exam for you interview</h3>
            <div className={'input-content'}>
                { getInput('subject', "Specify a name for the exam", 0) }
            </div>
        </div>,

        <div>
            <h3 className={'title-create-exam'}>Fill some details about the exam</h3>

            <div className={'input-details'}>
                { getInput('duration', "What is the maximum allowed time for this exam?", 0) }
                { getInput('passingScore', "What is the passing score for the exam?", 1) }
                { getInput('password', "Specify a password (optional)", 2) }
            </div>
        </div>,

        <div style={{padding: '20px', height: '70%'}} className={'inp'}>
            <textarea id={'in' + 0} defaultValue={map['description']} placeholder={'Write the description for this question'} onChange={(e) => {
                map['description'] = e.target.value
            }}/>
            <b style={{width: '94%', left: '3%', marginBottom: '15px'}} id={'line' + 0} className="line"/>
        </div>,

        <div>
            <h3 className={'title-create-exam'}>Add some question for your exam</h3>


        </div>,

    ]
    function getInput(name: string, placeholder: string, index: number, style: Record<string, string> = {}) {

        return (
            <div style={style} className={'inp'}>
                <input id={'in' + index} type="text" defaultValue={map[name]} placeholder={placeholder} onChange={(e) => {
                    map[name] = e.target.value
                }}/>
                <b id={'line' + index} className="line"/>
            </div>
        )
    }

    function plus() {
        const toCheck = [1, 3, 1]

        for (let i = 0; i < toCheck[index]; i++)  {

            const line = document.getElementById('line' +i)
            if (line === null) break

            // @ts-ignore
            const text = document.getElementById('in' + i).value
            if (text == '') return line.style.backgroundColor = 'red'
            else line.style.backgroundColor = 'var(--theme)'

        }
        setIndex(index + 1)
    }


    return (
        <div className="create-exam">
            <div className={'create-box'}>

                { content[index]}

                <div className={'arrows'}>
                    {index !== 0 && <BsArrowLeft className={'left'} onClick={() => setIndex(i => i + -1)}/>}
                    <BsArrowRight className={'right'} onClick={plus}/>
                </div>

            </div>
        </div>
    )
}