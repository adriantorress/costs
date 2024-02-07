import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import styles from './NewProject.module.css'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function NewProject() {

  const navigate = useNavigate()

  async function createPost(project) {
    console.log(project)
    if (!project?.category?.id || project.category?.id === "Selecione uma opção") {
      toast.error("Selecione a categoria")
      return
    }
    project.category_id = project?.category?.id

    await fetch("http://localhost:5000/projects", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
    })
      .then(data => {
        if (data.status <= 201) {
          //sucesso
          toast.success("Projeto criado com sucesso!")
          navigate('/projects', { state: { message: 'Projeto criado com sucesso!' } })
        } else {
          //error
          toast.error("Nome do projeto já existe!")
        }

      })
  }

  return (
    <div className={styles.newproject_container}>
      <h1>Criar Projeto</h1>
      <p>Crie seu projeto para depois adicionar os serviços</p>
      <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
    </div>
  )
};