export default function ({ processOne, batchSize }) {
  const pending = [];
  let inFlight = 0;

  const processQueue = () => {
    let taskId;
    while ((taskId = pending.shift()) && inFlight++ <= batchSize)
      processOne(taskId)
        .then(() => {
          inFlight--;
          setTimeout(processQueue);
        });
  };

  const enqueue = (taskId) => {
    pending.push(taskId);
    processQueue();
  };

  return { enqueue };
}
