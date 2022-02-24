import { render, screen } from '@testing-library/react'
import { Async } from '.'

test('it renders correctly', async () => {
    render(<Async />)

    screen.logTestingPlaygroundURL() // todo html gerado nos testes

    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(await screen.findByText('Button')).toBeInTheDocument()

    // await waitForElementToBeRemoved(screen.queryByText('Button'))   // como ver se um elemento foi removido da tela
})