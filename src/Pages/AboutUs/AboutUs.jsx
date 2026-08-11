import { HeartHandshake, Lightbulb, Shield, Leaf } from 'lucide-react'

const values = [
  {
    icon: HeartHandshake,
    title: 'Customer First',
    description:
      'Every decision we make starts with the customer. Their satisfaction is our true north star.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We constantly push boundaries to deliver smarter shopping experiences and better products.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description:
      'Transparency and honesty guide everything we do — with customers, partners, and each other.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description:
      'We reduce our environmental footprint through responsible sourcing, packaging, and operations.',
  },
]

const team = [
  {
    name: 'Alex Morgan',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
  },
  {
    name: 'Sarah Chen',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
  },
  {
    name: 'James Wilson',
    role: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
  },
  {
    name: 'Emily Davis',
    role: 'Marketing Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
  },
]

const stats = [
  { value: '7+', label: 'Years in Business' },
  { value: '50K+', label: 'Products' },
  { value: '200K+', label: 'Customers' },
  { value: '35+', label: 'Countries' },
]

const AboutUs = () => {
  return (
    <div className="w-full">
      <section className="w-full bg-gradient-to-r from-slate-900 to-blue-700 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            About Virevo
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Empowering shoppers with quality products, exceptional service, and a seamless
            online experience since 2018.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-5 text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-800">Our Story</h2>
              <p className="text-slate-600 leading-relaxed">
                Virevo was founded in 2018 with a simple mission: to make premium products
                accessible to everyone, everywhere. What started as a small online store has
                grown into a trusted ecommerce platform serving thousands of customers across
                multiple countries.
              </p>
              <p className="text-slate-600 leading-relaxed">
                From day one, we believed that shopping online should be effortless, enjoyable,
                and reliable. We carefully curate every product in our catalog, partnering with
                brands that share our commitment to quality and sustainability.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Today, Virevo continues to grow, but our core values remain unchanged — integrity,
                customer obsession, and relentless innovation. We're not just a marketplace; we're a
                community of people who love great products.
              </p>
            </div>
            <div className="relative">
              <div className="hidden sm:block absolute -top-6 -right-6 w-full h-full bg-blue-100 rounded-xl" />
              <img
                src="https://images.unsplash.com/photo-1556766800-3f6d5b3a6b8a?w=600&h=400&fit=crop"
                alt="Our Story"
                className="relative w-full rounded-xl shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Mission & Values</h2>
            <p className="text-slate-600">
              We are guided by a clear mission and a set of core values that shape everything we do.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white border border-slate-200 rounded-xl p-7 text-center transition-all duration-250 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <value.icon size={22} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Meet Our Team</h2>
            <p className="text-slate-600">
              A passionate group of individuals working together to redefine ecommerce.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-slate-200 rounded-xl p-7 text-center transition-all duration-250 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-blue-100 mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-1">{member.name}</h3>
                <p className="text-blue-700 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-extrabold text-blue-400 mb-1">{stat.value}</div>
                <p className="text-slate-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
