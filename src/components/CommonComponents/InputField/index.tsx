import './InputField.css'

interface InputFieldProps {
    Icon?: React.ElementType;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = (props: InputFieldProps) => {
    const { Icon, type = "text", placeholder, value, onChange } = props;
    return (
        <div className='input-field'>
            <div className="icon-container">
                {Icon && <Icon className="icon" />}
            </div>

            <div className="text-container">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="text-field"
                />
            </div>
        </div>
    )
}

export default InputField