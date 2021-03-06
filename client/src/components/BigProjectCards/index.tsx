import React, { useContext } from 'react'
import { Card, Empty, Spin, Row, Col, Image, Typography } from 'antd'
import { Project, useGetUserProjects } from '../../api'
import { projectPlaceholder } from '../../assets/images'
import styles from './index.module.scss'
import { useNavigate } from 'react-router-dom'
import { ProjectContext } from '../../context/selectedProject'

const {Text, Title } = Typography

const BigProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useContext(ProjectContext)
  const handleClick = () => {
    setProjectId('');
    setProjectId(project.id.toString())
    projectId && navigate(`/projects/${project.id}`)
  }

  return (
    <Card
      headStyle={{ display: 'flex', justifyContent: "center" }}
      bodyStyle={{ color: "black" }}
      className={styles.BigProjectCard}
      key={project.id}
      title={
        <Image preview={false} style={{ height: '100%', width: '100%' }} alt={project.name} src={project.pictures.length ? project.pictures[0] : projectPlaceholder} />
      }
      onClick={handleClick}
    >
      <Title style={{color: 'black'}} level={3}>{project.name}</Title>
      <Text style={{color: 'black'}}>{project.description}</Text>
    </Card>
  )
}

const BigProjectCards: React.FC = () => {
  const { data: projects, isLoading } = useGetUserProjects();

  return (
    <div className={styles.Wrapper}>
      <Row gutter={[16, 16]}>
        {isLoading ? (
          <Spin />
        ) : (
          projects ? (
            projects.map(project => {
              return (
                <Col sm={24} md={12} lg={6} >
                  <BigProjectCard project={project} />
                </Col>
              )
            })
          ) : (
            <Empty />
          )
        )}
      </Row>

    </div>
  )
}

export default BigProjectCards