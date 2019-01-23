import { FormHandler } from './FormHandler';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import React from 'react';
import { render } from 'react-dom';
import { JSONSchema6 } from 'json-schema';
import Form from 'react-jsonschema-form';
import { SchemaUIFactory } from './SchemaUIFactory';
import { SchemaFactory } from './SchemaFactory';
import ReactDOM from 'react-dom';

declare var global: any;
global.$ = global.jQuery = require('jquery');

// TODO: this should move to the summerform specific widget
require('summernote/dist/summernote-bs4');

/**
 * Code to accept new input for flashcards, notes, comments, etc.
 */
export class CreateFlashcardForm {
    /**
     * The FormHandler we're going to use.  We have to change it when we get
     * a new create flashcard request.
     */
    public formHandler: FormHandler = new FormHandler();

    private readonly targetElement: HTMLElement;

    constructor(targetElement: HTMLElement) {
        this.targetElement = targetElement;

        this.render();
    }

    public render() {
        // this allows us to have a fresh form each time. It seems very fast and
        // there appears to be no lag or issue with doing this.
        ReactDOM.unmountComponentAtNode(this.targetElement);

        const schema: JSONSchema6 = SchemaFactory.create();
        const schemaUI = SchemaUIFactory.create();

        if (!this.targetElement) {
            throw new Error('No schemaFormElement');
        }

        if (!schema) {
            throw new Error('No schema');
        }

        const onChangeCallback = () => (data: any) =>
            this.formHandler.onChange(data);
        const onSubmitCallback = () => (data: any) =>
            this.formHandler.onSubmit(data);
        const onErrorCallback = () => (data: any) =>
            this.formHandler.onError(data);

        const form = (
            <Form
                schema={schema}
                autocomplete="off"
                uiSchema={schemaUI}
                showErrorList={false}
                onChange={onChangeCallback()}
                onSubmit={onSubmitCallback()}
                onError={onErrorCallback()}
            />
        );

        render(form, this.targetElement);
    }
}
