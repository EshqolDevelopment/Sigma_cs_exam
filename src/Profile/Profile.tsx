// @ts-nocheck
import React, { useEffect, useState } from "react";
import { app } from '../firebase'
import { getFirestore, doc, getDoc, DocumentData} from 'firebase/firestore'
import AceEditor from "react-ace";
import {args, map} from "../Helper";



export default function Profile() {

    require('./Profile.css')
    const [questions, setQuestions] = useState([])
    const [reports, setReports] = useState(<div/>)


    function getLeftMenu() {
        const temp: JSX.Element[] = []
        const list = ['Questions', 'Exams', 'Results', 'Settings']

        list.forEach(item => {
            temp.push(
                <div className="left-menu-item" key={item}>
                    {item}
                </div>
            )
        })
        return temp
    }


    useEffect(() => {

        const db = getFirestore(app)
        const userId = 'yoav'
        const ref = doc(db, `${userId}/Questions`)

        const temp = []

        getDoc(ref).then(doc => {

            for (const key of Object.keys(doc.data())) {

                const data = JSON.parse(doc.data()[key])

                temp.push(
                    <div onClick={() => setReports(
                        <EditReport map={data}/>
                    )} className="question-item" key={data.name}>
                        <p>{data.name}</p>
                        <p>{data.subject}</p>
                        <p className={data.level == 'Easy' ? 'green' : data.level == 'Medium' ? 'orange' : 'Red'}>{data.level}</p>
                    </div>
                )
            }

            setQuestions(temp)

        })

    }, [])


    return (
        <div className="profile">
            <div className="profile-header">

            </div>

            <div className="profile-body">
                <div className="profile-body-left">
                    { getLeftMenu() }
                </div>

                <div className={'line-menu'}/>

                <div className="profile-body-right">
                    <CreateNew className="create-new" onClick={(() => window.location.href = '/upload')}>Create new</CreateNew>
                    <h3 className={'title'}>Your current questions</h3>

                    <div className={'list'}>
                        {questions}
                    </div>
                </div>
            </div>

            {reports}

        </div>
    )
}



function CreateNew(props: any) {
    require('./create_new.css')

    return (
        <div {...props}>
            <button className="continue-application">
                <div>
                    <div className="pencil" />
                    <div className="folder">
                        <div className="top">
                            <svg viewBox="0 0 24 27">
                                <path d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z" />
                            </svg>
                        </div>
                        <div className="paper" />
                    </div>
                </div>
                {props.children}
            </button>
        </div>
    );
}



function EditReport(props) {

    const map = props.map
    const languages = map.languages
    const tests = map.tests
    const args = map.args
    require('../NewQuestion/Report.css')

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

    return (
        <div className="report popup-shadow">
            <div className={'title'}>
                <h2 style={{borderBottom: '3px solid black'}}>Details about the question "{map['name']}"</h2>
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
                </div> : <div/> }

                {/*{ tests !== {} ? <div className={'report-left'}> {*/}
                {/*    previewMapArray(tests)*/}
                {/*} </div> : <div/> }*/}

            </div>

            <div className={'report-footer'}>
                <AceEditor mode="python" theme="monokai" fontSize={16} readOnly={true}
                           highlightActiveLine={false}
                           value={getDefault()} style={{width: '100%', height: '100%'}}/>
            </div>

            <button className={'submit-button button-22'}>Edit</button>
        </div>
    )
}