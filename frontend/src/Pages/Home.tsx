import KeyboardTypeAnimation from "@/components/pageComponents/Home/KeyboardTypeAnimation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Home = () => {

  return (
    <main className="w-full h-full">

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to the Home Page</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Improve your typing skills with our interactive challenges and real-time feedback.
              </p>
              <Button size="lg">Get Started</Button>
            </div>
            <KeyboardTypeAnimation />
          </div>
        </div>
      </section>

      <section id="Features" className="py-20 bg-muted" >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 gap-8">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Interactive Challenges</h3>
              <p>Engage with our typing challenges to improve your speed and accuracy</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Real-time Feedback</h3>
              <p>Get instant feedback on your typing performance and track your progress.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Customizable Lessons</h3>
              <p>Tailor your learning experience with customizable typing lessons.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-center">About Us</h2>
            <p className="text-lg text-center max-w-2xl mx-auto">
              We're passionate about helping people improve their typing skills. Our platform offers a fun and
              interactive way to practice typing, track your progress, and challenge yourself to become faster
              and more accurate.
            </p>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Stay Connected</h2>
            <form className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input type="email" placeholder="Enter your email" />
                <Button type="submit">Subscribe</Button>
              </div>
            </form>
          </div>
        </section>

    </main>
  )
}

export default Home