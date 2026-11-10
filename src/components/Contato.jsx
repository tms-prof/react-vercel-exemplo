export default function Contato({label1, label2, label3}){

    return (
      <form className="forms" action="">
        <label htmlFor="input1">{label1}:</label>
        <input id="input1" type="text" />
        <label htmlFor="input2">{label2}:</label>
        <input id="input2" type={label2=== "Email" ? "email" : "text"} />
        <label htmlFor="input3">{label3}:</label>
        <input id="input3" type="text" />
      </form>
    )


}