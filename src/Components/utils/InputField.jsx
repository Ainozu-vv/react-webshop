import React from "react";

const InputField = ({
  field,
  field_name,
  type = "text",
  col_span = 2,
  refField,
}) => {
  return (
    <div class={`relative z-0 w-full mb-5 group col-span-${col_span}`}>
      <input
        type={type}
        name={field}
        id={field}
        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent
            border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0
            focus:border-blue-600 peer
            "
        placeholder=""
        required
        ref={refField}
      />
      <label
        for={field}
        class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {field_name}
      </label>
    </div>
  );
};

export default InputField;
