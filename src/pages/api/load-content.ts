import wordbank from '../../content/wordbank.json';
import content from '../../content/content.json';

// const numberToStudy = 20;
// const maxNumberOfContexts = 5;

const fetchContentData = () => {
  return new Promise((resolve, reject) => {
    // Simulating API call delay with setTimeout
    setTimeout(() => {
      try {
        // Parsing the JSON data
        const parsedData = JSON.parse(JSON.stringify(wordbank));
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    }, 500); // Simulated delay of 1 second
  });
};

const fetchAccompanyingContextData = () => {
  return new Promise((resolve, reject) => {
    // Simulating API call delay with setTimeout
    setTimeout(() => {
      try {
        // Parsing the JSON data
        const parsedData = JSON.parse(JSON.stringify(content));
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    }, 500); // Simulated delay of 1 second
  });
};

const loadInPersonalStudyContent = async () => {
  try {
    const data = await fetchContentData();
    const contextData = await fetchAccompanyingContextData();

    // map to get IDs
    // then get the data for the ids
    // max of 5 IDs per context
    // sounds like Im already optmising. Just get them for now

    const accompanyingContextsData = await Promise.all(
      data.map(async (item) => {
        const contextIdsArr = item?.contexts;
        const contextDataArr = contextData.filter((context) =>
          contextIdsArr?.includes(context.id),
        );
        console.log('## contextDataArr: ', contextDataArr);

        return {
          ...item,
          contextData: contextDataArr,
        };
      }),
    );
    return accompanyingContextsData;
  } catch (error) {
    console.log('## loadInPersonalStudyContent error: ', error);
  }
};

export default loadInPersonalStudyContent;
