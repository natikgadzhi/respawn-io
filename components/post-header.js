import DateFormatter from '../components/date-formatter'

export default function PostHeader({ title, date}) {
  return (
    <>
      <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-tight md:leading-none mb-8 text-center md:text-left">
      {title}
      </h1>
      <div className="mb-6 text-lg">
        <DateFormatter dateString={date} />
      </div>
    </>
  )
}
