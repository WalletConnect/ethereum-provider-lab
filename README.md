This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

See https://ethereum-provider-lab-untouched.vercel.app/

## Getting Started

### Environment Setup

This project requires a WalletConnect Cloud Project ID to connect to wallets. Follow these steps:

1.  Obtain a Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/).
2.  Create a file named `.env.local` in the project root.
3.  Copy the contents of `.env.local.example` into `.env.local`.
4.  Replace `YOUR_WALLETCONNECT_PROJECT_ID` in `.env.local` with your actual Project ID.

```bash
# Example .env.local file
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="abcdef1234567890..."
```

### Running the Development Server

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
