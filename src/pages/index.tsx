import { GetStaticProps } from 'next'
import Head from 'next/head'
import { stripe } from '../services/stripe'

import styles from './home.module.scss'
import { SubscribeButton } from '../components/SubscribeButton'


interface HomeProps {
  product: {
    priceId: string,
    amount: string,
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>News about the <span>React</span> world</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
    </>
  )
}
// passo o SSR (Server Side Rendering da Página até o Componente, como nome getServerSideProps)

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IsxTcC9KwmHIiRyH7sPZ0wt')
  // , {
  //   expand: ['product']  pega todas as informações dos produtos
  // } 

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
}