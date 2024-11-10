import Image from "next/image"
import { Code2, Users, GitPullRequest } from "lucide-react"

export function Features() {
  return (
    <div className="py-24">
      <h2 className="text-4xl font-bold text-center mb-12 blue-text-gradient">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <div className="card border shadow-2xl">
          <figure className="px-10 pt-10">
            <Code2 className="w-16 h-16" />
          </figure>
          <div className="card-body items-center text-center">
            <h3 className="card-title">Share Code</h3>
            <p>Share your projects and get feedback from the community</p>
          </div>
        </div>

        <div className="card border shadow-2xl">
          <figure className="px-10 pt-10">
            <Users className="w-16 h-16" />
          </figure>
          <div className="card-body items-center text-center">
            <h3 className="card-title">Join Communities</h3>
            <p>Connect with other developers who share your interests</p>
          </div>
        </div>

        <div className="card border shadow-2xl">
          <figure className="px-10 pt-10">
            <GitPullRequest className="w-16 h-16" />
          </figure>
          <div className="card-body items-center text-center">
            <h3 className="card-title">Collaborate</h3>
            <p>Work together on projects through pull requests</p>
          </div>
        </div>
      </div>
    </div>
  )
}
