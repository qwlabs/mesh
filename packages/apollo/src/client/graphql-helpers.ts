export const extractRelyData = <N, R>(connection: any, mapping?: (node: N) => {}): R[] => {
  return (connection?.edges ?? []).map((edge: any) => {
    return mapping ? mapping(edge.node) : edge.node
  })
}
