import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom';
import { useGetUserProject, useGetDeployStatus, Project } from '../../api'
import { Col, Row, Carousel, Descriptions, Badge, Spin, Empty, Image } from 'antd';
import styles from './index.module.scss'
import { ProjectContext } from '../../context/selectedProject';
import placeholderCat from '../../assets/projectPlaceholder350x350.png'
import moment from 'moment'

const ProjectDescriptions: React.FC<{ project: Project }> = ({ project }) => {
  const { data: isDeployed } = useGetDeployStatus(project.deploy)
  return (
    <Descriptions title={project.name} bordered column={1}>
      <Descriptions.Item label="Project Description">{project.description}</Descriptions.Item>
      <Descriptions.Item label="Tech used">
        {project.assigned_skills?.length && project.assigned_skills.map((skill, i) => {
          return (i + 1) === (project.assigned_skills?.length) ? skill.name : skill.name + ', '
        })}
      </Descriptions.Item>
      {project.date && <Descriptions.Item label="Date released">{`${moment(project.date).format('MMMM YYYY')}`}</Descriptions.Item>}
      <Descriptions.Item label="Status">
        {isDeployed ? <Badge status='success' text='Running' /> : <Badge status='error' text='Not deployed or down' />}
      </Descriptions.Item>
    </Descriptions>
  )
}

const ProjectCarousel: React.FC<{ pictures: string[] }> = ({ pictures }) => {
  return (
    <div className={styles.CarouselWrapper}>
      <Carousel >
      {pictures.length ? pictures.map((picture) => (
        <Image style={{ width: '100%' }} alt='project' src={picture} preview={false} />
      )) : (
            <Image alt='placeholder' src={placeholderCat} preview={false} />
      )}
      </Carousel>
    </div>
  )
}

const ProjectGrid: React.FC<{ id: string }> = ({ id }) => {
  const [projectId] = useContext(ProjectContext)
  const { data: project, isLoading, refetch } = useGetUserProject(projectId);

  useEffect(() => {
    const getproject = async () => await refetch();
    getproject()
  }, [projectId, refetch])

  return (
    isLoading ? <Spin /> :
      project ? (
        <div style={{ overflowX: 'hidden', overflowY: 'auto' }}>
          <Row className={styles.Row} gutter={32} >
            <Col className={styles.ColumnPadding} span={3} />
            <Col span={18} >
              <Row justify='center'>
                <ProjectCarousel pictures={project.pictures ?? []} />
              </Row>
              <div>
                <ProjectDescriptions project={project} />
              </div>
            </Col>
            <Col className={styles.ColumnPadding} span={3} />
          </Row>
        </div>
      ) : <Empty />
  )
}

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [id, setId] = useState<string>()
  useEffect(() => {
    if (projectId) {
      setId(projectId)
    }
  }, [projectId])
  return (
    id ? (
      <ProjectGrid id={id} />
    ) : (
      <div>Projects cards here</div>
    ) 
  )
}

export default ProjectPage