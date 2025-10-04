const messageTypeClass = {
  error: 'flow-message flow-message--error',
  success: 'flow-message flow-message--success',
  info: 'flow-message flow-message--info',
}

const defaultMessageClass = 'flow-message'

function NodeMessages({ messages }) {
  if (!messages || messages.length === 0) {
    return null
  }

  return (
    <ul className="flow-messages" role="alert">
      {messages.map((message) => (
        <li key={message.id} className={messageTypeClass[message.type] || defaultMessageClass}>
          {message.text}
        </li>
      ))}
    </ul>
  )
}

function FieldMessages({ messages }) {
  if (!messages || messages.length === 0) {
    return null
  }

  return (
    <div className="flow-field-messages" role="alert">
      {messages.map((message) => (
        <p key={message.id} className={messageTypeClass[message.type] || defaultMessageClass}>
          {message.text}
        </p>
      ))}
    </div>
  )
}

function FlowNode({ node, isSubmitting }) {
  const { attributes, meta, messages, type } = node

  if (attributes.node_type === 'input') {
    if (attributes.type === 'hidden') {
      return <input type="hidden" name={attributes.name} value={attributes.value ?? ''} />
    }

    if (attributes.type === 'submit') {
      return (
        <div className="flow-actions">
          <button
            className="btn btn-primary"
            type="submit"
            name={attributes.name}
            value={attributes.value ?? ''}
            disabled={attributes.disabled || isSubmitting}
          >
            {attributes.label?.text || meta.label?.text || attributes.value || 'Continue'}
          </button>
        </div>
      )
    }

    if (attributes.type === 'button') {
      return (
        <div className="flow-actions">
          <button
            className="btn"
            type="button"
            name={attributes.name}
            value={attributes.value ?? ''}
            disabled={attributes.disabled || isSubmitting}
          >
            {attributes.label?.text || meta.label?.text || attributes.value || 'Continue'}
          </button>
        </div>
      )
    }

    if (attributes.type === 'checkbox') {
      return (
        <label className="flow-field flow-field--checkbox">
          <input
            type="checkbox"
            name={attributes.name}
            defaultChecked={Boolean(attributes.value)}
            value={attributes.value ?? 'true'}
            disabled={attributes.disabled || isSubmitting}
          />
          <span>{attributes.label?.text || meta.label?.text || attributes.name}</span>
          <FieldMessages messages={messages} />
        </label>
      )
    }

    const fieldId = attributes.name || `${attributes.node_type}-${attributes.type}`

    return (
      <div className="flow-field">
        <label htmlFor={fieldId}>
          <span className="flow-label">{attributes.label?.text || meta.label?.text || attributes.name}</span>
          <input
            id={fieldId}
            className="form-controller"
            name={attributes.name}
            type={attributes.type}
            defaultValue={attributes.value ?? ''}
            autoComplete={attributes.autocomplete}
            pattern={attributes.pattern}
            required={attributes.required}
            maxLength={attributes.maxlength}
            minLength={attributes.minlength}
            disabled={attributes.disabled || isSubmitting}
          />
        </label>
        <FieldMessages messages={messages} />
      </div>
    )
  }

  if (attributes.node_type === 'text') {
    return <p className="flow-text">{attributes.text.text}</p>
  }

  if (attributes.node_type === 'a') {
    return (
      <a className="flow-link" href={attributes.href}>
        {attributes.title?.text || attributes.href}
      </a>
    )
  }

  if (type === 'img' && attributes.node_type === 'img') {
    return <img className="flow-image" src={attributes.src} alt={attributes.alt ?? ''} />
  }

  return null
}

export default function OryFlowForm({ flow, onSubmit, isSubmitting }) {
  if (!flow) {
    return null
  }

  return (
    <form className="form flow-form" action={flow.ui.action} method={flow.ui.method} onSubmit={onSubmit} noValidate>
      <NodeMessages messages={flow.ui.messages} />
      {flow.ui.nodes.map((node, index) => (
        <FlowNode
          key={`${node.group}-${node.attributes?.name || node.attributes?.id || index}`}
          node={node}
          isSubmitting={isSubmitting}
        />
      ))}
    </form>
  )
}
