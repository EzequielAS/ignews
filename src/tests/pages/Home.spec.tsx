import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import { mocked } from 'jest-mock'
import Home, { getStaticProps } from '../../pages'


jest.mock('next/router')
jest.mock('next-auth/client', () => {
    return {
        useSession: () => [null, false]
    }
})
jest.mock('../../services/stripe')


describe('Home page', () => {
    it('renders correctly', () => {
        render (<Home product={{priceId: 'fake-price-id', amount: '$10.00'}} />)

        expect(screen.getByText('for $10.00 month')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const retrieveStripePriceMocked = mocked(stripe.prices.retrieve)

        retrieveStripePriceMocked.mockResolvedValueOnce({ // mockResolved para funções assíncronas
            id: 'fake-price-id',
            unit_amount: 1000,
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual( // verifica se o objeto é totalmente igual
            expect.objectContaining({ // verifica se o objeto está contido no objeto original
                props: {
                    product: {
                        priceId: 'fake-price-id',
                        amount: '$10.00'
                    }
                }
            })
        )
    })
})