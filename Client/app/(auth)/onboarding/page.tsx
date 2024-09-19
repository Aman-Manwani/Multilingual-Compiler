import AccountProfile from '@/components/shared/AccountProfile'
import React from 'react'

const page = () => {
  return (
    <main className="mx-auto flex flex-col sm:w-full lg:w-2/4 justify-start sm:px-5 py-20">
      <h1 className="font-bold text-3xl text-white">OnBoarding</h1>
      <p className="mt-5 text-base-regular text-white">
        Complete your profile now to use AI-Compiler
      </p>

      <section className="mt-3 bg-dark-2 py-10 ">
        <AccountProfile />
      </section>
    </main>
  )
}

export default page
