import React, { useEffect, useState } from "react";
import { app } from '../firebase'
import { getFirestore, doc, getDoc } from 'firebase/firestore'



export default function Profile() {

    require('./Profile.css')
    const [questions, setQuestions] = useState([])
    const [reports, setReports] = useState(<div/>)
    const [index, setIndex] = useState(0)

    const content = [
        <div>
            <CreateNew className="create-new" onClick={(() => window.location.href = '/upload')}>Create new</CreateNew>
            <h3 className={'title'}>Your current questions</h3>

            <div className={'list'}>
                {questions}
            </div>
        </div>,

        <div>
            <CreateNew className="create-new" onClick={(() => window.location.href = '/upload')}>Create new</CreateNew>
            <h3 className={'title'}>Your saved exams</h3>

            <div className={'list'}>
                {questions}
            </div>
        </div>
    ]

    function getLeftMenu() {
        const temp: JSX.Element[] = []
        const list = ['Questions', 'Exams', 'Results', 'Settings']

        list.forEach(item => {
            temp.push(
                <div onClick={() => setIndex(list.indexOf(item))} className="left-menu-item" key={item}>
                    {item}
                </div>
            )
        })
        return temp
    }

    useEffect(() => {
        console.log(index)
    }, [index])

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


    useEffect(() => {

        const db = getFirestore(app)
        const userId = 'yoav'
        const ref = doc(db, `${userId}/Questions`)

        // @ts-ignore
        const temp = []

        // @ts-ignore
        getDoc(ref).then(doc => {

            // @ts-ignore
            for (const key of Object.keys(doc.data())) {

                // @ts-ignore
                const data = JSON.parse(doc.data()[key])

                temp.push(
                    <div className="question-item" key={data.name}>
                        <p>{data.name}</p>
                        <p>{data.subject}</p>
                        <p className={data.level == 'Easy' ? 'green' : data.level == 'Medium' ? 'orange' : 'Red'}>{data.level}</p>
                    </div>
                )
            }

            // @ts-ignore
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
                    {content[index]}
                </div>
            </div>

            {reports}

        </div>
    )
}



