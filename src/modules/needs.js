import Immutable from "immutable";
import { mergeMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import API from '../util/api';
import { push } from 'connected-react-router/immutable';
import moment from 'moment';

/***** Actions *****/
const SUBMIT_NEED = "SUBMIT_NEED";
const SUBMIT_NEED_SUCCEEDED = "SUBMIT_NEED_SUCCEEDED";
const SUBMIT_NEED_FAILED = "SUBMIT_NEED_FAILED";

const REQUEST_NEED_ASSIGNMENT = "REQUEST_NEED_ASSIGNMENT";
const CANCEL_REQUEST_NEED_ASSIGNMENT = "CANCEL_REQUEST_NEED_ASSIGNMENT";

const SUBMIT_FOR_ASSIGNMENT = "SUBMIT_FOR_ASSIGNMENT";
const SUBMIT_FOR_ASSIGNMENT_SUCCEEDED = "SUBMIT_FOR_ASSIGNMEN_SUCCEEDEDT";
const SUBMIT_FOR_ASSIGNMENT_FAILED = "SUBMIT_FOR_ASSIGNMENT_FAILED";

const LOAD_NEED_DETAILS = "LOAD_NEED_DETAILS";
const LOAD_NEED_DETAILS_SUCCEEDED = "LOAD_NEED_DETAILS_SUCCEEDED";
const LOAD_NEED_DETAILS_FAILED = "LOAD_NEED_DETAILS_FAILED";

// const LOAD_NEED_CONTACT_INFO = "LOAD_NEED_CONTACT_INFO";
// const LOAD_NEED_CONTACT_INFO_FAILED = "LOAD_NEED_CONTACT_INFO_FAILED";
// const LOAD_NEED_CONTACT_INFO_SUCCEEDED = "LOAD_NEED_CONTACT_INFO_SUCCEEDED";

const RELEASE_NEED_ASSIGNMENT = "RELEASE_NEED_ASSIGNMENT";
const RELEASE_NEED_ASSIGNMENT_SUCCEEDED = "RELEASE_NEED_ASSIGNMENT_SUCCEEDED";
const RELEASE_NEED_ASSIGNMENT_FAILED = "RELEASE_NEED_ASSIGNMENT_FAILED";

const COMPLETE_NEED_ASSIGNMENT = "COMPLETE_NEED_ASSIGNMENT";
const COMPLETE_NEED_ASSIGNMENT_SUCCEEDED = "COMPLETE_NEED_ASSIGNMENT_SUCCEEDED";
const COMPLETE_NEED_ASSIGNMENT_FAILED = "COMPLETE_NEED_ASSIGNMENT_FAILED";

const LOAD_MY_TASKS = "LOAD_MY_TASKS";
const LOAD_MY_TASKS_FAILED = "LOAD_MY_TASKS_FAILED";
const LOAD_MY_TASKS_SUCCEEDED = "LOAD_MY_TASKS_SUCCEEDED";

const defaultState = Immutable.Map({
  submit: Immutable.Map({

  }),
  request: Immutable.Map({
    dialogOpen: false,
    requestedNeed: null,
    state: "", // "", requestingAssignment
  }),
  details: Immutable.Map({
    id: null,
    status: "",
    contactDetails: Immutable.Map({
      info: null,
      status: ""  // loading, loaded, failed
    })
  }),
  myTasks: Immutable.Map({
    status: "",
    error: null,
    tasks: Immutable.Set(),
  })
});

const moduleRootUIStateKey = ["ui", "needs"];
const taskRequestKey = ["ui", "needs", "request"];
const needSubmissionKey = ["ui", "needs", "submit"];
const needDetailsKey = ["ui", "needs", "details"];
const myTasksKey = ["ui", "needs", "myTasks"];
// const contactInfoKey = ["ui", "needs", "details", "contactDetails"];

/***** Reducers *****/
export function reducer(state = defaultState, action) {
  // If the module state hasn't been initialized yet then do that first.
  if (!state.getIn(moduleRootUIStateKey)) {
    state = state.setIn(moduleRootUIStateKey, defaultState);
  }

  switch (action.type) {
    case REQUEST_NEED_ASSIGNMENT:
      return state
        .setIn([...taskRequestKey, "dialogOpen"], true)
        .setIn([...taskRequestKey, "status"], "")
        .setIn([...taskRequestKey, "requestedNeed"], action.need);

    case CANCEL_REQUEST_NEED_ASSIGNMENT:
      return state
        .setIn([...taskRequestKey, "dialogOpen"], false)
        .setIn([...taskRequestKey, "status"], "")
        .setIn([...taskRequestKey, "requestedNeed"], null);

    case SUBMIT_FOR_ASSIGNMENT:
      return state
        .setIn([...needSubmissionKey, "status"], "requestingAssignment");

    case SUBMIT_FOR_ASSIGNMENT_SUCCEEDED:
      return state
        .setIn([...taskRequestKey, "dialogOpen"], false)
        .setIn([...taskRequestKey, "status"], "")
        .setIn([...taskRequestKey, "requestedNeed"], null)
        .setIn([...needSubmissionKey, "status"], "assignmentSuccessful");

    case LOAD_NEED_DETAILS:
      return state
        .setIn([...needDetailsKey, "contactDetails"], Immutable.Map({}))
        .setIn([...needDetailsKey, "id"], action.id)
        .setIn([...needDetailsKey, "status"], "loading");

    case LOAD_NEED_DETAILS_FAILED:
      return state
        .setIn([...needDetailsKey, "error"], action.error)
        .setIn([...needDetailsKey, "need"], null)
        .setIn([...needDetailsKey, "status"], "failed");

    case LOAD_NEED_DETAILS_SUCCEEDED:
      return state
        .setIn([...needDetailsKey, "need"], Immutable.fromJS(action.need))
        .setIn([...needDetailsKey, "status"], "loaded");

    case LOAD_MY_TASKS:
      return state
        .setIn([...myTasksKey, "tasks"], Immutable.Set())
        .setIn([...myTasksKey, "status"], "loading");

    case LOAD_MY_TASKS_FAILED:
      return state
        .setIn([...myTasksKey, "error"], action.error)
        .setIn([...myTasksKey, "status"], "failed");

    case LOAD_MY_TASKS_SUCCEEDED:
      return state
        .setIn([...myTasksKey, "tasks"], Immutable.fromJS(action.tasks))
        .setIn([...myTasksKey, "status"], "loaded");

    default:
      return state;
  }
}

/***** Action Creators *****/
export const requestNeedAssignment = (need) => ({ type: REQUEST_NEED_ASSIGNMENT, need });
export const cancelRequestNeedAssignment = () => ({ type: CANCEL_REQUEST_NEED_ASSIGNMENT });

export const submitForAssignment = (need) => ({ type: SUBMIT_FOR_ASSIGNMENT, need });
const submitForAssignmentSucceeded = () => ({ type: SUBMIT_FOR_ASSIGNMENT_SUCCEEDED });
const submitForAssignmentFailed = () => ({ type: SUBMIT_FOR_ASSIGNMENT_FAILED });

export const submitNeed = (need) => ({ type: SUBMIT_NEED, need });
const submitNeedFailed = () => ({ type: SUBMIT_NEED_FAILED });
const submitNeedSucceeded = () => ({ type: SUBMIT_NEED_SUCCEEDED });

export const loadNeedDetails = (id) => ({ type: LOAD_NEED_DETAILS, id });
const loadNeedDetailsSucceeded = (need) => ({ type: LOAD_NEED_DETAILS_SUCCEEDED, need });
const loadNeedDetailsFailed = (error) => ({ type: LOAD_NEED_DETAILS_FAILED, error });

export const releaseNeedAssignment = (id) => ({ type: RELEASE_NEED_ASSIGNMENT, id });
const releaseNeedAssignmentSucceeded = () => ({ type: RELEASE_NEED_ASSIGNMENT_SUCCEEDED });
const releaseNeedAssignmentFailed = (error) => ({ type: RELEASE_NEED_ASSIGNMENT_FAILED, error });

// export const loadNeedContactInfo = (id) => ({ type: LOAD_NEED_CONTACT_INFO, id });
// const loadNeedContactInfoFailed = (error) => ({ type: LOAD_NEED_CONTACT_INFO_FAILED, error });
// const loadNeedContactInfoSucceeded = (contactInfo) => ({ type: LOAD_NEED_CONTACT_INFO_SUCCEEDED, contactInfo });

export const completeNeedAssignment = (id) => ({ type: COMPLETE_NEED_ASSIGNMENT, id });
const completeNeedAssignmentSucceeded = () => ({ type: COMPLETE_NEED_ASSIGNMENT_SUCCEEDED });
const completeNeedAssignmentFailed = (error) => ({ type: COMPLETE_NEED_ASSIGNMENT_FAILED, error });

export const loadMyTasks = () => ({ type: LOAD_MY_TASKS });
const loadMyTasksFailed = () => ({ type: LOAD_MY_TASKS_FAILED });
const loadMyTasksSucceeded = (tasks) => ({ type: LOAD_MY_TASKS_SUCCEEDED, tasks });

/***** side effects, only as applicable. e.g. thunks, epics, etc *****/
export const submitNeedEpic = action$ =>
  action$.pipe(
    ofType(SUBMIT_NEED),
    mergeMap(action => {
      return API.getAuthenticatedJSONRequestObservable("/needs/new", "post", action.need).pipe(
        mergeMap(resp => {
          // console.log(resp);
          return [submitNeedSucceeded(), push('/request-successful')];
        }),
        catchError(err => {
          return [submitNeedFailed(err)];
        })
      )
    })
  );

export const submitForAssignmentEpic = action$ =>
  action$.pipe(
    ofType(SUBMIT_FOR_ASSIGNMENT),
    mergeMap(action => {
      return API.getAuthenticatedJSONRequestObservable("/needs/assign", "post", {id: action.need.id}).pipe(
        mergeMap(resp => {
          // console.log(resp);
          return [submitForAssignmentSucceeded(), push(`/needs/${action.need.id}`)];
        }),
        catchError(err => {
          if (err.status === 403) {
            alert(err.response.message);
          }
          return [submitForAssignmentFailed(err)];
        })
      )
    })
  );


export const loadNeedDetailsEpic = action$ =>
  action$.pipe(
    ofType(LOAD_NEED_DETAILS),
    mergeMap(action => {
      return API.getAuthenticatedJSONRequestObservable(`/needs/${action.id}`, "get").pipe(
        mergeMap(resp => {
          // console.log(resp);
          let need = resp.response;
          need.id = action.id;
          need.createdAt = moment(need.createdAt._seconds * 1000);
          need.lastUpdatedAt = moment(need.lastUpdatedAt._seconds * 1000);
          if (need.owner && need.owner.takenAt) {
            need.owner.takenAt = moment(need.owner.takenAt._seconds * 1000);
          }
          return [loadNeedDetailsSucceeded(need)];
        }),
        catchError(err => {
          if (err.status === 404) {
            return [loadNeedDetailsFailed({message: "Item not found."})];
          }
          return [loadNeedDetailsFailed(err)];
        })
      )
    })
  );

export const releaseNeedAssignmentEpic = action$ =>
  action$.pipe(
    ofType(RELEASE_NEED_ASSIGNMENT),
    mergeMap(action => {
      return API.getAuthenticatedJSONRequestObservable(`/needs/${action.id}/release`, "post").pipe(
        mergeMap(resp => {
          return [releaseNeedAssignmentSucceeded(), push("/volunteer")];
        }),
        catchError(err => {
          if (err.status === 404) {
            return [releaseNeedAssignmentFailed({message: "Item not found."})];
          }
          return [releaseNeedAssignmentFailed(err)];
        })
      )
    })
  );


export const completeNeedAssignmentEpic = action$ =>
  action$.pipe(
    ofType(COMPLETE_NEED_ASSIGNMENT),
    mergeMap(action => {
      return API.getAuthenticatedJSONRequestObservable(`/needs/${action.id}/complete`, "post").pipe(
        mergeMap(resp => {
          return [completeNeedAssignmentSucceeded(), push("/volunteer")];
        }),
        catchError(err => {
          if (err.status === 404) {
            return [completeNeedAssignmentFailed({message: "Item not found."})];
          }
          return [completeNeedAssignmentFailed(err)];
        })
      )
    })
  );


export const loadMyTasksEpic = action$ =>
  action$.pipe(
    ofType(LOAD_MY_TASKS),
    mergeMap(() => {
      return API.getAuthenticatedJSONRequestObservable(`/needs/my-tasks`, "get").pipe(
        mergeMap(resp => {
          let needs = resp.response;
          needs = needs.map(need => {
            need.createdAt = moment(need.createdAt._seconds * 1000);
            need.lastUpdatedAt = moment(need.lastUpdatedAt._seconds * 1000);
            if (need.owner && need.owner.takenAt) {
              need.owner.takenAt = moment(need.owner.takenAt._seconds * 1000);
            }
            return need;
          });
          console.log(needs);
          return [loadMyTasksSucceeded(needs)];
        }),
        catchError(err => {
          return [loadMyTasksFailed(err)];
        })
      )
    })
  );
