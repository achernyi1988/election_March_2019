import React from "react"
import {getCandidates, vote} from "../redux/action"
import {connect} from "react-redux"
import {Field, reduxForm, SubmissionError} from "redux-form"
import {Button} from 'semantic-ui-react'
import history from "../history";
import timer from "../utils/timer"
import _ from "lodash"

class Candidate extends React.Component {

    componentDidMount() {
        this.props.getCandidates();

        timer(1000).then( () => {
            if(_.isEmpty(this.props.current_voter) ){
                console.log("isEmpty obj. switch to home page " );
                history.push("/");
            }
        });
    }

    renderError = ({error, touched}) => {

        if (error && touched) {

            return (
                <div className={"ui message error"}>
                    <div className={"header"}> {error} </div>
                </div>
            )
        }
    }

    renderField = (formProps) => {
        const className = `field ${(formProps.meta.touched && formProps.meta.error) ? "error" : "" }`;
        const inactive = (formProps.label) ? "" : "none";

        return (
            <div className={className}>
                <label style={{display: `${inactive}`}}>
                    <Field name={formProps.input.name} component="input" type={formProps.type} value={formProps.label}/>
                    {" " + formProps.label}
                </label>
                {this.renderError(formProps.meta)}
            </div>
        )
    }

    renderRadioButtons = () => {
        if (!this.props.candidates) {
            return null;
        }
        return (<div className="candidates-table">
            <h3>Список кандидатов:</h3>
            <table className="ui striped  table">

                {this.props.candidates.map((candidate) => {
                    return (
                        <tr>
                            <td>
                                <div key={candidate.fullName}>
                                    <label>
                                        <Field name="candidates" component={this.renderField} type="radio"
                                               label={candidate.fullName}/>
                                    </label>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </table>
        </div>)
    }
    onSubmit = ({candidates}) => {
        console.log("onSubmit", candidates, this.props.current_voter);

        if (!candidates) {
            throw new SubmissionError({
                voter_unavailable: 'не выбран кандидат из списка!!',
                _error: 'no candidate selected'
            })
        }

        if (!this.props.current_voter.text) {
            throw new SubmissionError({
                voter_unavailable: 'не выбран избиратель, ' +
                'выйдете в главное меню и выберите себя из списка',
                _error: 'voter failed!'
            })
        }
        if (this.props.current_voter) {
            this.props.vote(candidates, this.props.current_voter.value, this.onStartVoting);
        }
    }

    onStartVoting = () => {
        console.log("onStartVoting in progress");

        history.push("/thanks");
    }

    onEndVoting = () => {

    }

    renderVoter = () => {

        return (
            <div className="welcome-message">
                <p>Участие в выборах является свободным и добровольным.</p>
                <p>Никто не вправе принуждать граждан голосовать за кого-либо из кандидатов, а также препятствовать
                    свободному волеизъявлению избирателей.</p>
                <p> Пожалуйста, выберите кандидата из списка и проголосуйте. </p>
                <p> ВНИМАНИЕ! Вы можете проголосовать только за одного кандидата или выбрать пункт "Против Всех" </p>
            </div>
        )
    }

    render() {
        console.log("Candidate:render", this.props.current_voter);


        const {pristine, reset, submitting} = this.props;

        return (
            <div className="ui container padding-100 list-candidates">
                <h3> Приветствуем, <span>{this.props.current_voter.text}</span>!</h3>
                <div className="ui equal width grid">
                    <div className="row">
                        <div className="column">
                            {this.renderVoter()}
                        </div>
                        <div className="column">
                            <form className={"ui form error"} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                                {this.renderRadioButtons()}
                                <div className="ui buttons" style={{marginTop: 50 + "px"}}>
                                    <Button primary disabled={submitting}>Проголосовать</Button>
                                    <div className="or"></div>
                                    <Button disabled={pristine || submitting} onClick={reset}>Очистить </Button>
                                </div>
                                <label>
                                    <Field name="voter_unavailable" component={this.renderField}/>
                                </label>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps", state);
    return {
        candidates: state.candidates.arr,
        current_voter: state.current_voter
    };
}


export default reduxForm({
    form: "CandidateForm"
})(connect(mapStateToProps, {
    getCandidates,
    vote
})(Candidate));