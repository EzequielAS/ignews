import { loadStripe } from "@stripe/stripe-js" //sdk stripe para usar no front

export async function getStripeJs() {
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

    return stripeJs
}