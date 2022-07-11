# Batched status updates

|      |                                                                          |
|------|--------------------------------------------------------------------------|
|Title |Batching of job status updates provided from graphql server to the client |
|Tags  |Client, responsiveness, network, graphql, job-status                      |
|Status|Committed                                                                 |
|Date  |10th July, 2022                                                           |


## Problem

Currently, the server transmits progress updates for each job as an individual message on the websocket link. These messages are consumed by the client, which updates the progress and/or status for each job on the receipt of each message.

This setup works OK for a small number of jobs, but as soon as the number of in-progress jobs rises, the client spends more and more time repainting the job list. This results in a client UI which becomes less and less responsive.

## Proposed solution

Job status updates received from the external downloader will no longer be immediatekly put on the websocket. Instead, these updates will be gathered in a short term buffer on the server. A separate code path will periodically check the buffer for contents, and transmit them as a single websocket message if any updates are found. Any updates sent to the client will be removed from the buffer.

This will make the update (and therefore repaint) frequency on the client deterministic (and lower) which in turn will give us a more responsive UI.
