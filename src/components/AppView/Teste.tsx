interface IButtonProps {
  name: string;
}

const Button = ({ name }: IButtonProps) => <button>{name}</button>;

const list = [<Button key="1" name="bruce" />, <Button key="2" name="billy" />];

const filtered = list.filter((comp) => comp.props.name === 'billy');

const Comp: React.FC = () => {
  return <div>{filtered}</div>;
};
export { Comp };
