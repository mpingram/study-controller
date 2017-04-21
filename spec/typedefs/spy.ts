interface ISpy {

  report: (methodReference: Function, ...parameters: any[]) => void;

}

export default ISpy;