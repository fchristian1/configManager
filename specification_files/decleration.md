Generic placeholders are defined as follows:

<boolean>: a boolean that can take the values true or false
<duration>: a duration matching the regular expression ((([0-9]+)y)?(([0-9]+)w)?(([0-9]+)d)?(([0-9]+)h)?(([0-9]+)m)?(([0-9]+)s)?(([0-9]+)ms)?|0), e.g. 1d, 1h30m, 5m, 10s
<filename>: a valid path in the current working directory
<float>: a floating-point number
<host>: a valid string consisting of a hostname or IP followed by an optional port number
<int>: an integer value
<labelname>: a string matching the regular expression [a-zA-Z_][a-zA-Z0-9_]*. Any other unsupported character in the source label should be converted to an underscore. For example, the label app.kubernetes.io/name should be written as app_kubernetes_io_name.
<labelvalue>: a string of unicode characters
<path>: a valid URL path
<scheme>: a string that can take the values http or https
<secret>: a regular string that is a secret, such as a password
<string>: a regular string
<size>: a size in bytes, e.g. 512MB. A unit is required. Supported units: B, KB, MB, GB, TB, PB, EB.
<tmpl_string>: a string which is template-expanded before usage