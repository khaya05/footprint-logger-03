import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from './Card';
import CardContent from './CardContent';

const BarGraph = ({data}) => {
  return (
    <Card className='md:col-span-2'>
      <CardContent>
        <h3 className='text-lg font-semibold mb-4'>Weekly Emissions</h3>
        <ResponsiveContainer width='100%' height={200}>
          <BarChart data={data}>
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='emissions' fill='#22c55e' />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default BarGraph