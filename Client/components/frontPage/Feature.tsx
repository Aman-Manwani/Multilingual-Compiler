import React from 'react'
import {
    BoltIcon,
    CalendarDaysIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";

const Feature = () => {

    const primaryFeatures = [
        {
          name: "Code",
          description:
            "Effortlessly write code in different programming languages using our intuitive, in-browser editor,built for programmers to focus on what they do best.",
          href: "#",
          icon: BoltIcon,
        },
        {
          name: "Compile",
          description:
            "Compile your programming language code instantly with our built-in, high-performance compiler—right from your browser",
          href: "#",
          icon: UsersIcon,
        },
        {
          name: "Collaborate",
          description:
            "Collaborate in real-time with your team/friends together seamlessly from anywhere with our integrated coding platform.",
          href: "#",
          icon: CalendarDaysIcon,
        },
    ];
  return (
    <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-400">
                Code faster
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Everything you need to code your program
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Code Together, Compile Anywhere,
              </p>
              <p className="mt-0 text-lg leading-8 text-gray-300">
                Powering Collaboration Across 10+ Languages!
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {primaryFeatures.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <dt className="text-base font-semibold leading-7 text-white">
                      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-300">
                      <p className="flex-auto">{feature.description}</p>
                      <p className="mt-6">
                        <a
                          href={feature.href}
                          className="text-sm font-semibold leading-6 text-indigo-400"
                        >
                          Learn more <span aria-hidden="true">→</span>
                        </a>
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
  )
}

export default Feature
