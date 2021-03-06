import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { getSession } from 'next-auth/client'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'


const post = {
    slug: 'my-new-post', 
    title: 'My New Post', 
    content: '<p>Post content</p>', 
    updatedAt: '10 de Abril'
}

jest.mock('next-auth/client')
jest.mock('../../services/prismic')


describe('Post page', () => {
    it('renders correctly', () => {
        render (<Post post={post} />)

        expect(screen.getByText('My New Post')).toBeInTheDocument()
        expect(screen.getByText('Post content')).toBeInTheDocument()
    })

    it('redirects user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        } as any)

        const response = await getServerSideProps({
            req: {
                cookies: {},
            },
            params: { 
                slug: 'my-new-post'
            }
        } as any)

        expect(response).toEqual( // verifica se o objeto é totalmente igual
            expect.objectContaining({ // verifica se o objeto está contido no objeto original
                redirect: {
                    destination: `/posts/preview/my-new-post`,
                    permanent: false
                }
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession)
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        {type: 'heading', text: 'My New Post'}
                    ],
                    content: [
                        {type: 'paragraph', text: 'Post content'}
                    ],
                },
                last_publication_date: '04-01-2021'
            })
        }as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)

        const response = await getServerSideProps({
            req: {
                cookies: {},
            },
            params: { 
                slug: 'my-new-post'
            }
        } as any)

        expect(response).toEqual( // verifica se o objeto é totalmente igual
            expect.objectContaining({ // verifica se o objeto está contido no objeto original
                props: {
                    post: {
                        slug: 'my-new-post', 
                        title: 'My New Post', 
                        content: '<p>Post content</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )
    })
})