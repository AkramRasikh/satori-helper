import getGlossikaFavourites from '@/api/glossika-api';

export default function Glossika(props) {
  const glossikaSentences = props.glossikaSentences;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Glossika</h1>
      <div>
        <ul
          style={{
            listStyleType: 'none',
            padding: 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {glossikaSentences.map((sentence) => {
            return (
              <li
                key={sentence.uuid}
                style={{
                  border: '2px solid grey',
                  padding: '10px',
                }}
              >
                <div>
                  <p>{sentence.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const glossikaData = await getGlossikaFavourites();

    const targetMap = glossikaData.target_map;

    const dataArray = [];

    for (const key in targetMap) {
      if (Object.hasOwnProperty.call(targetMap, key)) {
        dataArray.push(targetMap[key]);
      }
    }

    return {
      props: {
        glossikaSentences: dataArray,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        glossikaSentences: null,
      },
    };
  }
}
