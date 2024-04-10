#!/bin/bash

set -e

BUILD_STATUS=$1

if [[ "$BUILD_STATUS" == "success" ]]; then


MESSAGE=$(cat <<-END
# <font color=\"info\">hello ${GIT_COMMITTER_NAME}: ${APP_NAME}构建成功啦！</font>
> PIPELINE_ID: ${PIPELINE_ID}
> [查看详情](${PIPELINE_URL})
END
)

else

MESSAGE=$(cat <<-END
# <font color=\"warning\">hello ${GIT_COMMITTER_NAME}: ${APP_NAME}构建失败啦！</font>
> PIPELINE_ID: ${PIPELINE_ID}
> [查看详情](${PIPELINE_URL})
END
)

fi

PAYLOAD=$(cat <<-END
{
    "msgtype": "markdown",
    "markdown": {
        "content": "${MESSAGE}",
        "mentioned_list":["@all"]
    }
}
END
)

curl "${NOTIFY_URL}" \
-H 'Content-Type: application/json' \
-d "${PAYLOAD}"
