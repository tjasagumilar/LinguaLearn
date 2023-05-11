import React , {useEffect, useState}from 'react'

interface DataItem {
  id: number;
  ime: number
}

function App() {
  const [data, setData] = useState<DataItem[]>([])

  useEffect (() => {
    fetch('http://localhost:5000/test')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err =>console.log(err))
  })                          
  
  return(          
    <div>
      <table>
        <thead>
          <th>Id</th>
          <th>Ime</th>
        </thead>
        <tbody>
        {data.map((d, i) => (
          <tr key={i}>
            <td>{d.id}</td>
            <td>{d.ime}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default App