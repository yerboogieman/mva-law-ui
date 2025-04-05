import {useState} from "react";

const EMPTY_CASE_ITEM = {
   title: '',
   estimatedCost: '',
   comments: ''
};

function CaseDetails() {

   const [caseItems, setCaseItems] = useState([]);

   return (
      <div>
         <CaseForm setCaseItems={setCaseItems}/>
         <CaseItems caseItems={caseItems}/>
      </div>
   );
}

function CaseForm({setCaseItems}) {

   const [caseItem, setCaseItem] = useState(EMPTY_CASE_ITEM);

   function handleInputChange(event) {

      const {name, value} = event.target

      setCaseItem((prevProps) => ({...prevProps, [name]: value}));
   }

   function handleSubmit(event) {

      event.preventDefault();

      setCaseItems(prevCaseItems => {
         return [
            ...prevCaseItems,
            caseItem
         ]
      });

      setCaseItem(EMPTY_CASE_ITEM);
   }

   return (
      <form onSubmit={handleSubmit} className="row g-3 p-0">
         <div className="col-6 input-group-sm">
            <label htmlFor="title" className="form-label">Case Item</label>
            <input
               type="text"
               name="title"
               id="title"
               value={caseItem.title}
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
               value={caseItem.estimatedCost}
               onChange={handleInputChange}
               className="form-control"
            />
         </div>
         <div className="col-md-12 input-group-sm">
            <label htmlFor="comments" className="form-label">Comments</label>
            <textarea
               name="comments"
               id="comments"
               value={caseItem.comments}
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

function CaseItems({caseItems}) {
   return (
      <table>
         <thead>
         <tr>
            <th>Title</th>
            <th>Est. Cost</th>
            <th>Notes/Comments</th>
         </tr>
         </thead>
         {caseItems.map((item) => <CaseItem item={item}/>)}
      </table>
   );
}

function CaseItem({item}) {
   return (
      <tr>
         <td>{item.title}</td>
         <td>{item.estimatedCost}</td>
         <td>{item.comments}</td>
      </tr>
   );
}

export default CaseDetails