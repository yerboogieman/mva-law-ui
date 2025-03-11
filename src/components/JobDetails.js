import {useState} from "react";

const EMPTY_JOB_ITEM = {
   title: '',
   estimatedCost: '',
   comments: ''
};

function JobDetails() {

   const [jobItems, setJobItems] = useState([]);

   return (
      <div>
         <JobForm setJobItems={setJobItems}/>
         <JobItems jobItems={jobItems}/>
      </div>
   );
}

function JobForm({setJobItems}) {

   const [jobItem, setJobItem] = useState(EMPTY_JOB_ITEM);

   function handleInputChange(event) {

      const {name, value} = event.target

      setJobItem((prevProps) => ({...prevProps, [name]: value}));
   }

   function handleSubmit(event) {

      event.preventDefault();

      setJobItems(prevJobItems => {
         return [
            ...prevJobItems,
            jobItem
         ]
      });

      setJobItem(EMPTY_JOB_ITEM);
   }

   return (
      <form onSubmit={handleSubmit} className="row g-3 p-0">
         <div className="col-6 input-group-sm">
            <label htmlFor="title" className="form-label">Job Item</label>
            <input
               type="text"
               name="title"
               id="title"
               value={jobItem.title}
               onChange={handleInputChange}
               className="form-control"
            />
         </div>
         <div className="col-6 input-group-sm">
            <label htmlFor="estimatedCost" className="form-label">Estimated Cost</label>
            <input
               type="text"
               name="estimatedCost"
               id="estimatedCost"
               value={jobItem.estimatedCost}
               onChange={handleInputChange}
               className="form-control"
            />
         </div>
         <div className="col-md-12 input-group-sm">
            <label htmlFor="comments" className="form-label">Comments</label>
            <textarea
               name="comments"
               id="comments"
               value={jobItem.comments}
               onChange={handleInputChange}
               className="form-control">
               </textarea>
         </div>
         <div className="col-12 input-group-sm">
            <button type="submit" className="btn btn-primary float-end">Sign in</button>
         </div>
      </form>
   );
}

function JobItems({jobItems}) {
   return (
      <table>
         <thead>
         <tr>
            <th>Title</th>
            <th>Est. Cost</th>
            <th>Notes/Comments</th>
         </tr>
         </thead>
         {jobItems.map((item) => <JobItem item={item}/>)}
      </table>
   );
}

function JobItem({item}) {
   return (
      <tr>
         <td>{item.title}</td>
         <td>{item.estimatedCost}</td>
         <td>{item.comments}</td>
      </tr>
   );
}

export default JobDetails