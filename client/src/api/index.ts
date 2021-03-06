import {
  useQuery,
  UseQueryResult,
  QueryClient
} from 'react-query'

export const queryClient = new QueryClient();

//** Projects */
export type Skill = {
  id: number
  name: string
  picture: string
}

export type Project = {
  id: number
  custom_order: number
  name: string
  description: string
  date: Date
  pictures: string[]
  gitHub?: string
  deploy?: string
  assigned_skills?: Skill[]
}



export const useGetUserProjects: () => UseQueryResult<Project[], Error> = () =>
  useQuery('projects', async () => {
    console.log('Getting projects...')
    const url = `/api/projects`

    const res = await fetch(url);
    const data = await res.json();
    return data as Project[]
  }, {
    retry: false,
  })

export const useGetUserProject: (id: string) => UseQueryResult<Project, Error> = (id) =>
  useQuery('project', async () => {
    console.log(`Getting project with id ${id}`)
    const url = `/api/projects/${id}`

    const res = await fetch(url);
    const data = await res.json() as Project;

    return data
  }, {
    retry: false
  })

/* //TODO: Future work
export const useGetDeployStatus: (url?: string) => UseQueryResult<'success' | 'error', Error> = (url) =>
  useQuery('deployment status', async () => {
    if (!url) return 'error'
    const [, , , username, application] = url.split('/')
    console.log(`Checking if ${username}/${application} is deloyed...`)

    const deployRes = await fetch(`https://api.github.com/repos/${username}/${application}/deployments`);
    const deployData = await deployRes.json()
    if (!deployData.length) return 'error'
    const statusResponse = await fetch(deployData[0].statuses_url);
    const statusData = await statusResponse.json();

    if (statusData[0].state === 'success') return 'success'
    return 'error'
  }, {
    retry: false,
    refetchInterval: 5000
  })
*/

//** Unsplash API */
export type Photo = {
  id: number;
  width: number;
  height: number;
  urls: { large: string; regular: string; raw: string; small: string };
  color: string | null;
  user: {
    username: string;
    name: string;
  };
};

type ImageUrls = string[]

export const GetUnsplashImg: () => UseQueryResult<string[], Error> = () =>
  useQuery('get-unsplash-images', async () => {
    if (process.env.NODE_ENV !== 'production') return
    console.log('Getting unsplash images...')
    const url = `https://api.unsplash.com/collections/i-X3O5Jac7E/photos?client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`
    const imageUrls: ImageUrls = []

    const res = await fetch(url);
    const data = await res.json();
    data.forEach((apiResult: Photo) => {
      imageUrls.push(apiResult.urls.regular)
    })
    return imageUrls ?? []
  })