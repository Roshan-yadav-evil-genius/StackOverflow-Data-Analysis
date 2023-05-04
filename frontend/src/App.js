import "./App.css";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

function App() {

  const [show, setshow] = useState(false);
  const [Data2021, setData2021] = useState(null);
  const [Data2022, setData2022] = useState(null);

  const [total,setTotal]=useState(null)

  const [current2021, setcurrent2021] = useState(null);
  const [current2022, setcurrent2022] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/2021")
      .then((response) => response.json())
      .then((data) => {
        setData2021(data);
        console.log(data);
      });
    fetch("http://127.0.0.1:5000/2022")
      .then((response) => response.json())
      .then((data) => {
        setData2022(data);
        console.log(data);
      });
    fetch("http://127.0.0.1:5000/")
      .then((response) => response.json())
      .then((data) => {
        setTotal(data);
        console.log(data);
      });
  }, []);

  const [State, setState] = useState({
    series: [
      {
        name: "Student 2021",
        data: [44, 55, 41, 64, 22, 43, 21],
      },
      {
        name: "Student 2022",
        data: [53, 32, 33, 52, 13, 44, 32],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 430,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories: ["ok", 2002, 2003, 2004, 2005, 2006, 2007],
      },
    },
  });

  const ShowGraphForId = (id) => {
    setshow(true);
    console.log(id);
    let render2021 = Data2021.find((items) => items.id === id);
    let render2022 = Data2022.find(
      (items) => items.AgeGroup === render2021.AgeGroup
    );
    setcurrent2021(render2021);
    setcurrent2022(render2022);

    // Main Graph
    let newstate = { ...State };
    let outof21 = render2021.data.map((items) => items.Users);
    outof21 = outof21.reduce((a, b) => a + b);
    let outof22 = render2022.data.map((items) => items.Users);
    outof22 = outof22.reduce((a, b) => a + b);

    newstate.series = [
      {
        "name":"2021"   ,  
         data: render2021.data.map((items) => {
          return ((items.Users / outof21) * 100).toFixed(1);
        }),
      },
      {
        "name":"2021"   ,   
        data: render2022.data.map((items) => {
          return ((items.Users / outof22) * 100).toFixed(1);
        }),
      },
    ];
    newstate.options = {
      ...State.options,
      xaxis: { categories: render2021.data.map((items) => items.Languages) },
    };
    setState(newstate);
  };
  console.log(current2021);
  console.log(current2022);

  const cnvrtObjject = (myobject) => {
    let max = Object.entries(myobject).reduce((max, [key, value]) => {
      return value > myobject[max] ? key : max;
    }, Object.keys(myobject)[0]);
    return Object.entries(myobject).map(([name, count]) => {
      if (name === max) {
        return {
          name,
          count,
          "max":true
        };
      }else{
        return {
          name,
          count,
          "max":false
        };
      }
    });
  };
  if (show) {
    return (
      <div className="page">
        <div>
          {current2021 ? (
            <h2>Report For {current2021.AgeGroup}</h2>
          ) : (
            <p>Loading....</p>
          )}
        </div>
        <div className="buttons">
          {Data2021 ? (
            Data2021.map((items) => {
              return (
                <button
                  onClick={() => ShowGraphForId(items.id)}
                  key={items.id}>
                  {items.AgeGroup} <br /> <span className="percent">{items.percent} %</span>
                </button>
              );
            })
          ) : (
            <p>Loading....</p>
          )}
        </div>
        <div className="MyGraph">
          {State ? (
            <ReactApexChart
              options={State.options}
              series={State.series}
              type="bar"
              height={400}
            />
          ) : (
            <p>Loading....</p>
          )}
        </div>
        <div className="mytable">
          {current2021 ? (
            <div className="sd2021">
              <h1>2021 Students Learned </h1>
              <div className="cards">
                {current2021.data.map((items) => {
                  return (
                    <div className="card">
                      <h3 className="title">
                        <span>{items.Languages} </span> From
                      </h3>
                      <div className="from">
                        {cnvrtObjject(items.From).map((item, index) => (
                          <tr key={index} className={item.max ? "highlite2021":"normal"}>
                            <td>{item.name}</td>
                            <td>
                              {((item.count / items.outof) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p>Loading....</p>
          )}
          {current2022 ? (
            <div className="sd2022">
              <h1>2022 Students Learned </h1>
              <div className="cards">
                {current2022.data.map((items) => {
                  return (
                    <div className="card">
                      <h3 className="title">
                        {" "}
                        <span>{items.Languages} </span>From
                      </h3>
                      <div className="from">
                        {cnvrtObjject(items.From).map((item, index) => (
                          <tr key={index} className={item.max ? "highlite2022":"normal"}>
                            <td>{item.name}</td>
                            <td>
                              {((item.count / items.outof) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p>Loading....</p>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="welcomme">
        <h1>
          Stackoverflow Survey Aanalysis By Team <span>F</span>
        </h1>
        <div className="summary">
          {total ? total.map((item,index)=>{
            <tr key={index}>
                            <div className="name">{item.name}</div>
                            <div className="value">
                              {item.value}%
                            </div>
                          </tr>
          }):<p>Loaading...</p>}
        </div>
        <div className="getreport">
          <h2>Get Report For Age Group :</h2>
          <div className="buttons">
            {Data2021 ? (
              Data2021.map((items) => {
                return (
                  <button
                    onClick={() => ShowGraphForId(items.id)}
                    key={items.id}>
                    {items.AgeGroup} <br /> <span className="percent">{items.percent} %</span>
                  </button>
                );
              })
            ) : (
              <p>Loading....</p>
            )}
          </div>
        </div>
        <div className="info">
          <h3>Presented By :</h3>
          <div>
            <h3>
              Roshan Yadav <span> (Python Developer)</span>
            </h3>
            <h3>
              Ashish Yadav <span>(React Developer)</span>
            </h3>
            <h3>
              Yuvam Kumar <span>(Frontend Designer)</span>
            </h3>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
