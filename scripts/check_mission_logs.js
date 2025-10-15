import EventSource from 'eventsource';

const missionId = 'RBd_rzO_qyC-Gil2erLaW';

const es = new EventSource(`http://localhost:4000/api/agent/mission/${missionId}/stream`);

es.onmessage = (event) => {
  const log = JSON.parse(event.data);
  console.log('Log:', log);
  if (log.status === 'completed' || log.status === 'failed') {
    es.close();
    process.exit(0);
  }
};

es.onerror = (error) => {
  console.error('Error:', error);
  es.close();
  process.exit(1);
};

setTimeout(() => {
  console.log('Timeout after 5 minutes');
  es.close();
  process.exit(1);
}, 5 * 60 * 1000);