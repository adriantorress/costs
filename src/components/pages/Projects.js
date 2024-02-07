import { useLocation } from 'react-router-dom'

import { useState, useEffect } from 'react'

import Message from '../layout/Message'
import Container from '../layout/Container'
import Loading from '../layout/Loading'
import LinkButton from '../layout/LinkButton'
import ProjectCard from '../project/ProjectCard'


import styles from './Projects.module.css'
import { toast } from 'react-toastify'

export default function Projects() {

  const [projects, setProjects] = useState([])
  const [removeLoading, setRemoveLoading] = useState(false)


  useEffect(() => {
    setTimeout(() => {
      fetch('http://localhost:5000/projects', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then((resp) => resp.json())
        .then((data) => {
          console.log(data.projects)
          setProjects(data.projects)
          setRemoveLoading(true)
        })
        .catch((err) => console.log(err))
    }, 300)
  }, [])

  function removeProject(id) {

    fetch(`http://localhost:5000/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }).then((resp) => resp.json())
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id))
        toast.success("Projeto removido com sucesso!")
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
      </div>
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard
              name={project.name}
              id={project.id}
              budget={project.budget}
              category={project.category_name}
              key={project.id}
              handleRemove={removeProject}>
            </ProjectCard>
          ))
        }
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 &&
          <p>Não há projetos cadastrados</p>
        }
      </Container>
    </div >
  )
};
