terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "us-east-1"
}

resource "aws_sqs_queue" "terraform_queue" {
  name                  = "movements.fifo"
  fifo_queue            = true
  deduplication_scope   = "messageGroup"
  fifo_throughput_limit = "perMessageGroupId"
}